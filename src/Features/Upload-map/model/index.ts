import { createEvent, createStore, createEffect } from "effector";
import { uploadMap } from "../../../Shared/API";
import { UploadMapData } from "../types";

export const uploadMapFx = createEffect(async (data: UploadMapData) => {
    const formData = new FormData();
    formData.append('title', data.title);
    if (data.desc) formData.append('desc', data.desc);
    if (data.file) formData.append('file', data.file);
    const response = await uploadMap(formData);
    return response;
});

export const $title = createStore<string>("").reset(uploadMapFx.done);
export const $mapFile = createStore<File | null>(null).reset(uploadMapFx.done);
export const $descriptionFile = createStore<File | null>(null).reset(uploadMapFx.done);

export const titleChanged = createEvent<string>();
export const mapFileChanged = createEvent<File | null>();
export const descriptionFileChanged = createEvent<File | null>();

$title.on(titleChanged, (_, title) => title)
$mapFile.on(mapFileChanged, (_, file) => file)
$descriptionFile.on(descriptionFileChanged, (_, file) => file)

export const $formData = createStore<UploadMapData>({
    title: "",
    desc: null,
    file: null,
});

$formData
    .on(titleChanged, (state, title) => ({ ...state, title }))
    .on(descriptionFileChanged, (state, desc) => ({ ...state, desc }))
    .on(mapFileChanged, (state, file) => ({ ...state, file }))
    .reset(uploadMapFx.done);

export const $uploadMapError = createStore<string | null>(null)
  .on(uploadMapFx.failData, (_, error) => 'Ошибка загрузки уровня: ' + error.message)
  .reset(uploadMapFx.done);
export const setUploadMapError = createEvent<string>();
$uploadMapError.on(setUploadMapError, (_, error) => error);