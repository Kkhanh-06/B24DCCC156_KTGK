import useInitModel from '@/hooks/useInitModel';
import type { GiangVien } from '@/pages/Study/typing';
import { getDanhSachGiangVien } from '@/services/Study/giangVien';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<GiangVien>('giang-vien', undefined, undefined, '/api');
	const { setLoading } = objInit;
	const [danhSachGiangVien, setDanhSachGiangVien] = useState<GiangVien[]>([]);

	const getDanhSachGiangVienModel = async (): Promise<GiangVien[]> => {
		setLoading(true);
		try {
			const response = await getDanhSachGiangVien();
			const data = (response?.data?.data ?? []) as GiangVien[];
			setDanhSachGiangVien(data);
			return data;
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setLoading(false);
		}
	};

	return {
		...objInit,
		danhSachGiangVien,
		setDanhSachGiangVien,
		getDanhSachGiangVienModel,
	};
};
