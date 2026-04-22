import type { BoLocKhoaHoc, KhoaHocPayload } from '@/pages/Study/typing';
import axios from '@/utils/axios';

export async function getDanhSachKhoaHoc(params?: BoLocKhoaHoc) {
	return axios.get('/api/khoa-hoc', { params });
}

export async function createKhoaHoc(payload: KhoaHocPayload) {
	return axios.post('/api/khoa-hoc', payload);
}

export async function updateKhoaHoc(id: string, payload: KhoaHocPayload) {
	return axios.put(`/api/khoa-hoc/${id}`, payload);
}

export async function deleteKhoaHoc(id: string) {
	return axios.delete(`/api/khoa-hoc/${id}`);
}
