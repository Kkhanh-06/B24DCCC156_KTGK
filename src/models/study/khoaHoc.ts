import useInitModel from '@/hooks/useInitModel';
import type {
	BoLocKhoaHoc as BoLocKhoaHocType,
	KhoaHoc,
	KhoaHocPayload,
	KieuSapXepHocVien,
	TrangThaiKhoaHoc,
} from '@/pages/Study/typing';
import { createKhoaHoc, deleteKhoaHoc, getDanhSachKhoaHoc, updateKhoaHoc } from '@/services/Study/khoaHoc';
import { message } from 'antd';
import { useState } from 'react';

const TRANG_THAI_HOP_LE: TrangThaiKhoaHoc[] = ['DANG_MO', 'DA_KET_THUC', 'TAM_DUNG'];

const normalizeCourseName = (name: string): string => name.trim().replace(/\s+/g, ' ').toLowerCase();

const normalizeBoLoc = (boLoc: BoLocKhoaHocType): BoLocKhoaHocType => ({
	keyword: boLoc.keyword?.trim() || undefined,
	giangVienId: boLoc.giangVienId || undefined,
	trangThai: boLoc.trangThai || undefined,
	sapXepHocVien: boLoc.sapXepHocVien || undefined,
});

const validatePayload = (payload: KhoaHocPayload): string | null => {
	if (!payload.tenKhoaHoc?.trim()) return 'Tên khóa học là bắt buộc';
	if (payload.tenKhoaHoc.trim().length > 100) return 'Tên khóa học không được vượt quá 100 ký tự';
	if (!payload.giangVienId) return 'Vui lòng chọn giảng viên hợp lệ';
	if (!Number.isInteger(payload.soLuongHocVien) || payload.soLuongHocVien < 0) {
		return 'Số lượng học viên phải là số nguyên không âm';
	}
	if (!TRANG_THAI_HOP_LE.includes(payload.trangThai)) return 'Vui lòng chọn trạng thái hợp lệ';
	return null;
};

export default () => {
	const objInit = useInitModel<KhoaHoc>('khoa-hoc', undefined, undefined, '/api');
	const { setDanhSach, setLoading, setFormSubmiting, formSubmiting, setTotal } = objInit;
	const [boLoc, setBoLoc] = useState<BoLocKhoaHocType>({});

	const getDanhSachKhoaHocModel = async (boLocParam?: BoLocKhoaHocType): Promise<KhoaHoc[]> => {
		const finalBoLoc = normalizeBoLoc(boLocParam ?? boLoc);
		setLoading(true);
		try {
			const response = await getDanhSachKhoaHoc(finalBoLoc);
			const data = (response?.data?.data ?? []) as KhoaHoc[];
			setDanhSach(data);
			setTotal(data.length);
			return data;
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setLoading(false);
		}
	};

	const applyBoLocModel = async (nextBoLoc: BoLocKhoaHocType): Promise<KhoaHoc[]> => {
		const finalBoLoc = normalizeBoLoc(nextBoLoc);
		setBoLoc(finalBoLoc);
		return getDanhSachKhoaHocModel(finalBoLoc);
	};

	const searchByName = (keyword?: string): Promise<KhoaHoc[]> => applyBoLocModel({ ...boLoc, keyword });

	const filterByLecturer = (giangVienId?: string): Promise<KhoaHoc[]> =>
		applyBoLocModel({ ...boLoc, giangVienId });

	const filterByStatus = (trangThai?: TrangThaiKhoaHoc): Promise<KhoaHoc[]> =>
		applyBoLocModel({ ...boLoc, trangThai });

	const sortByStudentCount = (sapXepHocVien?: KieuSapXepHocVien): Promise<KhoaHoc[]> =>
		applyBoLocModel({ ...boLoc, sapXepHocVien });

	const resetBoLoc = (): Promise<KhoaHoc[]> => {
		const emptyBoLoc: BoLocKhoaHocType = {};
		setBoLoc(emptyBoLoc);
		return getDanhSachKhoaHocModel(emptyBoLoc);
	};

	const validateDuplicateCourseName = async (tenKhoaHoc: string, currentId?: string): Promise<boolean> => {
		const tenDaChuanHoa = normalizeCourseName(tenKhoaHoc);
		if (!tenDaChuanHoa) return false;

		const response = await getDanhSachKhoaHoc();
		const danhSach = (response?.data?.data ?? []) as KhoaHoc[];

		return danhSach.some(
			(item) => normalizeCourseName(item.tenKhoaHoc) === tenDaChuanHoa && item.id !== currentId,
		);
	};

	const validateDeleteCondition = (khoaHoc: KhoaHoc): { valid: boolean; message?: string } => {
		if (khoaHoc.soLuongHocVien > 0) {
			return {
				valid: false,
				message: 'Không thể xóa khóa học có số lượng học viên lớn hơn 0',
			};
		}

		return { valid: true };
	};

	const taoKhoaHocModel = async (payload: KhoaHocPayload): Promise<KhoaHoc> => {
		const validationError = validatePayload(payload);
		if (validationError) {
			message.error(validationError);
			return Promise.reject(new Error(validationError));
		}

		if (formSubmiting) return Promise.reject(new Error('Form submiting'));
		setFormSubmiting(true);
		try {
			const duplicated = await validateDuplicateCourseName(payload.tenKhoaHoc);
			if (duplicated) {
				const errorMessage = 'Tên khóa học đã tồn tại';
				message.error(errorMessage);
				return Promise.reject(new Error(errorMessage));
			}

			const response = await createKhoaHoc(payload);
			message.success('Thêm khóa học thành công');
			await getDanhSachKhoaHocModel(boLoc);
			return response?.data?.data as KhoaHoc;
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setFormSubmiting(false);
		}
	};

	const capNhatKhoaHocModel = async (id: string, payload: KhoaHocPayload): Promise<KhoaHoc> => {
		const validationError = validatePayload(payload);
		if (validationError) {
			message.error(validationError);
			return Promise.reject(new Error(validationError));
		}

		if (formSubmiting) return Promise.reject(new Error('Form submiting'));
		setFormSubmiting(true);
		try {
			const duplicated = await validateDuplicateCourseName(payload.tenKhoaHoc, id);
			if (duplicated) {
				const errorMessage = 'Tên khóa học đã tồn tại';
				message.error(errorMessage);
				return Promise.reject(new Error(errorMessage));
			}

			const response = await updateKhoaHoc(id, payload);
			message.success('Cập nhật khóa học thành công');
			await getDanhSachKhoaHocModel(boLoc);
			return response?.data?.data as KhoaHoc;
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setFormSubmiting(false);
		}
	};

	const xoaKhoaHocModel = async (khoaHoc: KhoaHoc): Promise<void> => {
		const validationResult = validateDeleteCondition(khoaHoc);
		if (!validationResult.valid) {
			message.error(validationResult.message);
			return Promise.reject(new Error(validationResult.message));
		}

		setLoading(true);
		try {
			await deleteKhoaHoc(khoaHoc.id);
			message.success('Xóa khóa học thành công');
			await getDanhSachKhoaHocModel(boLoc);
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setLoading(false);
		}
	};

	return {
		...objInit,
		boLoc,
		setBoLoc,
		getDanhSachKhoaHocModel,
		applyBoLocModel,
		searchByName,
		filterByLecturer,
		filterByStatus,
		sortByStudentCount,
		resetBoLoc,
		validateDuplicateCourseName,
		validateDeleteCondition,
		taoKhoaHocModel,
		capNhatKhoaHocModel,
		xoaKhoaHocModel,
	};
};
