import { createEffect, createEvent, createStore } from 'effector';
import { axiosInstance } from '../../Shared/API';
import { $token, } from '../session';

export type MapItem = {
    id: string;
    title: string;
    desc_url: string;
    file_url: string;
};

export const $maps = createStore<MapItem[]>([]);

export const resetMaps = createEvent();

export const fetchMapsFx = createEffect<void, MapItem[], Error>(async () => {
    const token = $token.getState(); // получить токен синхронно

    const response = await axiosInstance.get('/client/v1/maps/', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data?.maps;
});

$maps
    .on(fetchMapsFx.doneData, (_, maps) => maps)
    .reset(resetMaps);
