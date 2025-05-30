package middleware

import (
	"context"

	"github.com/rs/zerolog"
	"google.golang.org/grpc"
	"google.golang.org/grpc/metadata"
)

func GRPCContextLoggerUnaryInterceptor(ctx context.Context) grpc.UnaryServerInterceptor {
	return func(innerCtx context.Context, req interface{},
		info *grpc.UnaryServerInfo, handler grpc.UnaryHandler,
	) (interface{}, error) {
		return handler(zerolog.Ctx(ctx).WithContext(innerCtx), req)
	}
}

type serverStreamWrapper struct {
	ss  grpc.ServerStream
	ctx context.Context //nolint:containedctx
}

func (w serverStreamWrapper) Context() context.Context        { return w.ctx }
func (w serverStreamWrapper) RecvMsg(msg interface{}) error   { return w.ss.RecvMsg(msg) }   //nolint:wrapcheck
func (w serverStreamWrapper) SendMsg(msg interface{}) error   { return w.ss.SendMsg(msg) }   //nolint:wrapcheck
func (w serverStreamWrapper) SendHeader(md metadata.MD) error { return w.ss.SendHeader(md) } //nolint:wrapcheck
func (w serverStreamWrapper) SetHeader(md metadata.MD) error  { return w.ss.SetHeader(md) }  //nolint:wrapcheck
func (w serverStreamWrapper) SetTrailer(md metadata.MD)       { w.ss.SetTrailer(md) }

func GRPCContextLoggerStreamInterceptor(ctx context.Context) grpc.StreamServerInterceptor {
	return func(srv interface{}, ss grpc.ServerStream, info *grpc.StreamServerInfo, handler grpc.StreamHandler) error {
		return handler(srv, serverStreamWrapper{
			ss:  ss,
			ctx: zerolog.Ctx(ctx).WithContext(ss.Context()),
		})
	}
}
