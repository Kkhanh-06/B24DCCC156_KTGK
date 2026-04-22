export type TrangThaiKhoaHoc = 'DANG_MO' | 'DA_KET_THUC' | 'TAM_DUNG';
export type KieuSapXepHocVien = 'ASC' | 'DESC';

export interface GiangVien {
	id: string;
	hoTen: string;
}

export interface KhoaHoc {
	_id?: string;
	id: string;
	tenKhoaHoc: string;
	giangVienId: string;
	tenGiangVien: string;
	soLuongHocVien: number;
	moTaHtml: string;
	trangThai: TrangThaiKhoaHoc;
	createdAt?: string;
	updatedAt?: string;
}

export interface KhoaHocPayload {
	tenKhoaHoc: string;
	giangVienId: string;
	soLuongHocVien: number;
	moTaHtml: string;
	trangThai: TrangThaiKhoaHoc;
}

export interface BoLocKhoaHoc {
	keyword?: string;
	giangVienId?: string;
	trangThai?: TrangThaiKhoaHoc;
	sapXepHocVien?: KieuSapXepHocVien;
}
