import axios from '@/utils/axios';

export async function getDanhSachGiangVien() {
	return axios.get('/api/giang-vien');
}
