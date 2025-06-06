package s3

import (
	"bytes"
	"context"
	"io"
	"mime"
	"net/http"
	"path/filepath"

	"github.com/aws/aws-sdk-go-v2/service/s3/types"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

const (
	cmpName = "s3"
)

type Client struct {
	s3  *s3.Client
	cfg Config
}

func New(cfg Config) (*Client, error) {
	creds := credentials.NewStaticCredentialsProvider(cfg.Key, cfg.Secret, "")

	// Кастомный V2-резолвер под Object Storage
	ycResolver := aws.EndpointResolverWithOptionsFunc(
		func(service, region string, _ ...interface{}) (aws.Endpoint, error) {
			if service == s3.ServiceID {
				return aws.Endpoint{
					PartitionID:       "yc",
					URL:               "https://storage.yandexcloud.net",
					SigningRegion:     cfg.Region, // "ru-central1"
					HostnameImmutable: true,
				}, nil
			}
			return aws.Endpoint{}, &aws.EndpointNotFoundError{}
		})

	base, err := config.LoadDefaultConfig(
		context.Background(),
		config.WithRegion(cfg.Region),
		config.WithCredentialsProvider(creds),
		config.WithEndpointResolverWithOptions(ycResolver), // ← главное отличие
	)
	if err != nil {
		return nil, err
	}

	s3cli := s3.NewFromConfig(base, func(o *s3.Options) {
		o.UsePathStyle = true // привычный формат storage.yandexcloud.net/bucket/object
	})

	return &Client{s3: s3cli, cfg: cfg}, nil
}

func (c *Client) UploadFile(ctx context.Context, key *string, reader io.Reader) error {
	// Автоматическое определение типа по расширению
	ext := filepath.Ext(*key)
	mimeType := http.DetectContentType([]byte(ext)) // лучше использовать mime.TypeByExtension
	if mimeType == "application/octet-stream" {
		mimeType = "application/octet-stream" // fallback
	} else {
		mimeType = mime.TypeByExtension(ext)
		if mimeType == "" {
			mimeType = "application/octet-stream"
		}
	}

	_, err := c.s3.PutObject(ctx, &s3.PutObjectInput{
		Bucket:             aws.String(c.cfg.Bucket),
		Key:                key,
		Body:               reader,
		ContentDisposition: aws.String("inline"),
		ContentType:        aws.String(mimeType),
	})
	return err
}

func (c *Client) DownloadFile(
	ctx context.Context,
	filename string,
) (result []byte, err error) {
	file, err := c.s3.GetObject(ctx, &s3.GetObjectInput{
		Bucket: aws.String(c.cfg.Bucket),
		Key:    aws.String(filename),
	})
	if err != nil {
		return nil, err
	}

	defer file.Body.Close()

	bytes, err := io.ReadAll(file.Body)
	if err != nil {
		return nil, err
	}

	return bytes, err
}

func (c *Client) UploadChunk(
	ctx context.Context,
	fileID string,
	chunkID int32,
	body []byte,
	uploadID *string,
	lastChunk bool,
) (uploadIDResponse string, fileSize int64, err error) {

	if uploadID != nil {
		uploadIDResponse = *uploadID
	} else {
		ext := filepath.Ext(fileID)
		mimeType := mime.TypeByExtension(ext)
		if mimeType == "" {
			mimeType = "application/octet-stream"
		}

		createOutput, err := c.s3.CreateMultipartUpload(ctx, &s3.CreateMultipartUploadInput{
			Bucket:             aws.String(c.cfg.Bucket),
			Key:                aws.String(fileID),
			ContentDisposition: aws.String("inline"),
			ContentType:        aws.String(mimeType),
		})
		if err != nil {
			return "", 0, err
		}

		uploadIDResponse = *createOutput.UploadId
	}

	_, err = c.s3.UploadPart(ctx, &s3.UploadPartInput{
		Bucket:     aws.String(c.cfg.Bucket),
		Key:        aws.String(fileID),
		UploadId:   aws.String(uploadIDResponse),
		PartNumber: aws.Int32(chunkID),
		Body:       bytes.NewReader(body),
	})
	if err != nil {
		return "", 0, err
	}

	if lastChunk {
		fileSize, err = c.finishUpload(ctx, fileID, uploadIDResponse)
		if err != nil {
			return "", fileSize, err
		}
		return uploadIDResponse, fileSize, nil
	}

	return uploadIDResponse, 0, nil
}

func (c *Client) finishUpload(
	ctx context.Context,
	fileID string,
	uploadID string,
) (fileSize int64, err error) {

	partsResp, err := c.s3.ListParts(ctx, &s3.ListPartsInput{
		Bucket:   aws.String(c.cfg.Bucket),
		Key:      aws.String(fileID),
		UploadId: aws.String(uploadID),
	})
	if err != nil {
		return 0, err
	}

	var completedParts []types.CompletedPart
	for _, part := range partsResp.Parts {
		completedParts = append(completedParts, types.CompletedPart{
			PartNumber: part.PartNumber,
			ETag:       part.ETag,
		})
		if part.Size != nil {
			fileSize += *part.Size
		}
	}

	_, err = c.s3.CompleteMultipartUpload(context.Background(), &s3.CompleteMultipartUploadInput{
		Bucket:   aws.String(c.cfg.Bucket),
		Key:      aws.String(fileID),
		UploadId: aws.String(uploadID),
		MultipartUpload: &types.CompletedMultipartUpload{
			Parts: completedParts,
		},
	})
	if err != nil {
		return fileSize, err
	}

	return fileSize, err
}

func (c *Client) DownloadChunk(
	ctx context.Context,
	fileID string,
	chunkID int32,
) ([]byte, error) {

	out, err := c.s3.GetObject(ctx, &s3.GetObjectInput{
		Bucket:     aws.String(c.cfg.Bucket),
		Key:        aws.String(fileID),
		PartNumber: aws.Int32(chunkID),
	})
	if err != nil {
		return nil, err
	}
	defer out.Body.Close()

	buf := &bytes.Buffer{}

	_, err = io.Copy(buf, out.Body)
	if err != nil {
		return nil, err
	}

	return buf.Bytes(), nil
}

func (c *Client) GetName() string {
	return cmpName
}
