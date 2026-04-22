import { Request, Response } from 'express';

type TrangThaiKhoaHoc = 'DANG_MO' | 'DA_KET_THUC' | 'TAM_DUNG';
type KieuSapXepHocVien = 'ASC' | 'DESC';

interface GiangVien {
	id: string;
	hoTen: string;
}

interface KhoaHoc {
	_id: string;
	id: string;
	tenKhoaHoc: string;
	giangVienId: string;
	tenGiangVien: string;
	soLuongHocVien: number;
	moTaHtml: string;
	trangThai: TrangThaiKhoaHoc;
	createdAt: string;
	updatedAt: string;
}

interface KhoaHocPayload {
	tenKhoaHoc: string;
	giangVienId: string;
	soLuongHocVien: number;
	moTaHtml?: string;
	trangThai: TrangThaiKhoaHoc;
}

const TRANG_THAI_HOP_LE: TrangThaiKhoaHoc[] = ['DANG_MO', 'DA_KET_THUC', 'TAM_DUNG'];

const giangVienMock: GiangVien[] = [
	{ id: 'GV001', hoTen: 'Nguyễn Thanh Chương' },
	{ id: 'GV002', hoTen: 'Trần Văn Hoàng' },
	{ id: 'GV003', hoTen: 'Lê Thị Hồng Nâu' },
	{ id: 'GV004', hoTen: 'Phạm Thị Dung' },
	{ id: 'GV005', hoTen: 'Đỗ Thị Liên' },
];

let khoaHocMock: KhoaHoc[] = [
	{
		_id: 'KH001',
		id: 'KH001',
		tenKhoaHoc: 'Lập trình React cơ bản',
		giangVienId: 'GV001',
		tenGiangVien: 'Nguyễn Thanh Chương',
		soLuongHocVien: 25,
		moTaHtml: '<p>Khóa học React dành cho người mới.</p>',
		trangThai: 'DANG_MO',
		createdAt: '2025-01-15T08:00:00.000Z',
		updatedAt: '2025-01-15T08:00:00.000Z',
	},
	{
		_id: 'KH002',
		id: 'KH002',
		tenKhoaHoc: 'Node.js nâng cao',
		giangVienId: 'GV002',
		tenGiangVien: 'Trần Văn Hoàng',
		soLuongHocVien: 0,
		moTaHtml: '<p>Khóa học Node.js chuyên sâu.</p>',
		trangThai: 'TAM_DUNG',
		createdAt: '2025-01-20T08:00:00.000Z',
		updatedAt: '2025-01-20T08:00:00.000Z',
	},
	{
		_id: 'KH003',
		id: 'KH003',
		tenKhoaHoc: 'Cơ sở dữ liệu SQL',
		giangVienId: 'GV003',
		tenGiangVien: 'Lê Thị Hồng Nâu',
		soLuongHocVien: 40,
		moTaHtml: '<p>Kiến thức SQL từ cơ bản đến nâng cao.</p>',
		trangThai: 'DA_KET_THUC',
		createdAt: '2025-01-25T08:00:00.000Z',
		updatedAt: '2025-01-25T08:00:00.000Z',
	},
	{
		_id: 'KH004',
		id: 'KH004',
		tenKhoaHoc: 'TypeScript thực chiến',
		giangVienId: 'GV001',
		tenGiangVien: 'Nguyễn Thanh Chương',
		soLuongHocVien: 18,
		moTaHtml: '<p>Ứng dụng TypeScript trong dự án frontend.</p>',
		trangThai: 'DANG_MO',
		createdAt: '2025-02-01T08:00:00.000Z',
		updatedAt: '2025-02-01T08:00:00.000Z',
	},
	{
		_id: 'KH005',
		id: 'KH005',
		tenKhoaHoc: 'Docker cho lập trình viên',
		giangVienId: 'GV004',
		tenGiangVien: 'Phạm Thị Dung',
		soLuongHocVien: 12,
		moTaHtml: '<p>Làm quen container và luồng deploy.</p>',
		trangThai: 'DANG_MO',
		createdAt: '2025-02-05T08:00:00.000Z',
		updatedAt: '2025-02-05T08:00:00.000Z',
	},
	{
		_id: 'KH006',
		id: 'KH006',
		tenKhoaHoc: 'Kiểm thử tự động với Cypress',
		giangVienId: 'GV005',
		tenGiangVien: 'Đỗ Thị Liên',
		soLuongHocVien: 9,
		moTaHtml: '<p>Viết test e2e cho ứng dụng web.</p>',
		trangThai: 'TAM_DUNG',
		createdAt: '2025-02-10T08:00:00.000Z',
		updatedAt: '2025-02-10T08:00:00.000Z',
	},
	{
		_id: 'KH007',
		id: 'KH007',
		tenKhoaHoc: 'Tối ưu hiệu năng frontend',
		giangVienId: 'GV002',
		tenGiangVien: 'Trần Văn Hoàng',
		soLuongHocVien: 32,
		moTaHtml: '<p>Kỹ thuật tối ưu tài nguyên và rendering.</p>',
		trangThai: 'DA_KET_THUC',
		createdAt: '2025-02-14T08:00:00.000Z',
		updatedAt: '2025-02-14T08:00:00.000Z',
	},
	{
		_id: 'KH008',
		id: 'KH008',
		tenKhoaHoc: 'Giao tiếp API với Axios',
		giangVienId: 'GV003',
		tenGiangVien: 'Lê Thị Hồng Nâu',
		soLuongHocVien: 0,
		moTaHtml: '<p>Quản lý request, interceptor và lỗi.</p>',
		trangThai: 'TAM_DUNG',
		createdAt: '2025-02-20T08:00:00.000Z',
		updatedAt: '2025-02-20T08:00:00.000Z',
	},
	{
		_id: 'KH009',
		id: 'KH009',
		tenKhoaHoc: 'Xây dựng giao diện với Ant Design',
		giangVienId: 'GV004',
		tenGiangVien: 'Phạm Thị Dung',
		soLuongHocVien: 27,
		moTaHtml: '<p>Thực hành Form, Table, Modal và validate.</p>',
		trangThai: 'DANG_MO',
		createdAt: '2025-02-26T08:00:00.000Z',
		updatedAt: '2025-02-26T08:00:00.000Z',
	},
	{
		_id: 'KH010',
		id: 'KH010',
		tenKhoaHoc: 'Kiến trúc Redux và side effects',
		giangVienId: 'GV005',
		tenGiangVien: 'Đỗ Thị Liên',
		soLuongHocVien: 21,
		moTaHtml: '<p>Quản lý state lớn với pattern rõ ràng.</p>',
		trangThai: 'DA_KET_THUC',
		createdAt: '2025-03-02T08:00:00.000Z',
		updatedAt: '2025-03-02T08:00:00.000Z',
	},
	{
		_id: 'KH011',
		id: 'KH011',
		tenKhoaHoc: 'Khái niệm CI/CD căn bản',
		giangVienId: 'GV001',
		tenGiangVien: 'Nguyễn Thanh Chương',
		soLuongHocVien: 14,
		moTaHtml: '<p>Thiết lập pipeline build và deploy.</p>',
		trangThai: 'DANG_MO',
		createdAt: '2025-03-08T08:00:00.000Z',
		updatedAt: '2025-03-08T08:00:00.000Z',
	},
	{
		_id: 'KH012',
		id: 'KH012',
		tenKhoaHoc: 'Khám phá React hooks nâng cao',
		giangVienId: 'GV002',
		tenGiangVien: 'Trần Văn Hoàng',
		soLuongHocVien: 36,
		moTaHtml: '<p>Ứng dụng hooks để giảm lặp và tăng tái sử dụng.</p>',
		trangThai: 'DA_KET_THUC',
		createdAt: '2025-03-15T08:00:00.000Z',
		updatedAt: '2025-03-15T08:00:00.000Z',
	},
];

const normalizeName = (name: string): string => name.trim().replace(/\s+/g, ' ').toLowerCase();

const getQueryValue = (value: string | string[] | undefined): string | undefined => {
	if (Array.isArray(value)) return value[0];
	return value;
};

const taoMaKhoaHoc = (): string => {
	const maxId = khoaHocMock.reduce((max, khoaHoc) => {
		const idNumber = Number(khoaHoc.id.replace('KH', ''));
		if (Number.isNaN(idNumber)) return max;
		return Math.max(max, idNumber);
	}, 0);

	return `KH${String(maxId + 1).padStart(3, '0')}`;
};

const layGiangVien = (giangVienId: string): GiangVien | undefined =>
	giangVienMock.find((giangVien) => giangVien.id === giangVienId);

const validatePayload = (payload: Partial<KhoaHocPayload>): string | null => {
	if (!payload.tenKhoaHoc || !payload.tenKhoaHoc.trim()) {
		return 'Tên khóa học là bắt buộc';
	}

	if (payload.tenKhoaHoc.trim().length > 100) {
		return 'Tên khóa học không được vượt quá 100 ký tự';
	}

	if (!payload.giangVienId || !layGiangVien(payload.giangVienId)) {
		return 'Vui lòng chọn giảng viên hợp lệ';
	}

	if (!Number.isInteger(payload.soLuongHocVien) || (payload.soLuongHocVien ?? -1) < 0) {
		return 'Số lượng học viên phải là số nguyên không âm';
	}

	if (!payload.trangThai || !TRANG_THAI_HOP_LE.includes(payload.trangThai)) {
		return 'Vui lòng chọn trạng thái hợp lệ';
	}

	return null;
};

const isDuplicateCourseName = (tenKhoaHoc: string, currentId?: string): boolean => {
	const tenDaChuanHoa = normalizeName(tenKhoaHoc);
	return khoaHocMock.some(
		(item) => normalizeName(item.tenKhoaHoc) === tenDaChuanHoa && item.id !== currentId,
	);
};

const getGiangVienList = (req: Request, res: Response) => {
	res.json({
		success: true,
		data: giangVienMock,
	});
};

const getKhoaHocList = (req: Request, res: Response) => {
	const keyword = getQueryValue(req.query.keyword as string | string[] | undefined);
	const giangVienId = getQueryValue(req.query.giangVienId as string | string[] | undefined);
	const trangThai = getQueryValue(req.query.trangThai as string | string[] | undefined) as
		| TrangThaiKhoaHoc
		| undefined;
	const sapXepHocVien = getQueryValue(req.query.sapXepHocVien as string | string[] | undefined) as
		| KieuSapXepHocVien
		| undefined;

	let ketQua = [...khoaHocMock];

	if (keyword?.trim()) {
		const keywordDaChuanHoa = normalizeName(keyword);
		ketQua = ketQua.filter((item) => normalizeName(item.tenKhoaHoc).includes(keywordDaChuanHoa));
	}

	if (giangVienId) {
		ketQua = ketQua.filter((item) => item.giangVienId === giangVienId);
	}

	if (trangThai && TRANG_THAI_HOP_LE.includes(trangThai)) {
		ketQua = ketQua.filter((item) => item.trangThai === trangThai);
	}

	if (sapXepHocVien === 'ASC' || sapXepHocVien === 'DESC') {
		ketQua = ketQua.sort((a, b) => {
			if (sapXepHocVien === 'ASC') return a.soLuongHocVien - b.soLuongHocVien;
			return b.soLuongHocVien - a.soLuongHocVien;
		});
	}

	res.json({
		success: true,
		data: ketQua,
	});
};

const createKhoaHoc = (req: Request, res: Response) => {
	const payload = req.body as Partial<KhoaHocPayload>;
	const validationError = validatePayload(payload);

	if (validationError) {
		res.status(400).json({
			success: false,
			message: validationError,
		});
		return;
	}

	if (isDuplicateCourseName(payload.tenKhoaHoc as string)) {
		res.status(400).json({
			success: false,
			message: 'Tên khóa học đã tồn tại',
		});
		return;
	}

	const giangVien = layGiangVien(payload.giangVienId as string) as GiangVien;
	const now = new Date().toISOString();
	const id = taoMaKhoaHoc();

	const khoaHocMoi: KhoaHoc = {
		_id: id,
		id,
		tenKhoaHoc: (payload.tenKhoaHoc as string).trim(),
		giangVienId: payload.giangVienId as string,
		tenGiangVien: giangVien.hoTen,
		soLuongHocVien: payload.soLuongHocVien as number,
		moTaHtml: payload.moTaHtml ?? '',
		trangThai: payload.trangThai as TrangThaiKhoaHoc,
		createdAt: now,
		updatedAt: now,
	};

	khoaHocMock = [khoaHocMoi, ...khoaHocMock];

	res.status(201).json({
		success: true,
		message: 'Thêm khóa học thành công',
		data: khoaHocMoi,
	});
};

const updateKhoaHoc = (req: Request, res: Response) => {
	const id = req.params.id;
	const payload = req.body as Partial<KhoaHocPayload>;
	const khoaHocIndex = khoaHocMock.findIndex((item) => item.id === id);

	if (khoaHocIndex < 0) {
		res.status(404).json({
			success: false,
			message: 'Không tìm thấy khóa học',
		});
		return;
	}

	const validationError = validatePayload(payload);
	if (validationError) {
		res.status(400).json({
			success: false,
			message: validationError,
		});
		return;
	}

	if (isDuplicateCourseName(payload.tenKhoaHoc as string, id)) {
		res.status(400).json({
			success: false,
			message: 'Tên khóa học đã tồn tại',
		});
		return;
	}

	const giangVien = layGiangVien(payload.giangVienId as string) as GiangVien;
	const current = khoaHocMock[khoaHocIndex];
	const khoaHocCapNhat: KhoaHoc = {
		...current,
		tenKhoaHoc: (payload.tenKhoaHoc as string).trim(),
		giangVienId: payload.giangVienId as string,
		tenGiangVien: giangVien.hoTen,
		soLuongHocVien: payload.soLuongHocVien as number,
		moTaHtml: payload.moTaHtml ?? '',
		trangThai: payload.trangThai as TrangThaiKhoaHoc,
		updatedAt: new Date().toISOString(),
	};

	khoaHocMock[khoaHocIndex] = khoaHocCapNhat;

	res.json({
		success: true,
		message: 'Cập nhật khóa học thành công',
		data: khoaHocCapNhat,
	});
};

const deleteKhoaHoc = (req: Request, res: Response) => {
	const id = req.params.id;
	const khoaHocIndex = khoaHocMock.findIndex((item) => item.id === id);

	if (khoaHocIndex < 0) {
		res.status(404).json({
			success: false,
			message: 'Không tìm thấy khóa học',
		});
		return;
	}

	const khoaHoc = khoaHocMock[khoaHocIndex];
	if (khoaHoc.soLuongHocVien > 0) {
		res.status(400).json({
			success: false,
			message: 'Không thể xóa khóa học có số lượng học viên lớn hơn 0',
		});
		return;
	}

	khoaHocMock = khoaHocMock.filter((item) => item.id !== id);

	res.json({
		success: true,
		message: 'Xóa khóa học thành công',
		data: khoaHoc,
	});
};

export default {
	'GET /api/giang-vien': getGiangVienList,
	'GET /api/khoa-hoc': getKhoaHocList,
	'POST /api/khoa-hoc': createKhoaHoc,
	'PUT /api/khoa-hoc/:id': updateKhoaHoc,
	'DELETE /api/khoa-hoc/:id': deleteKhoaHoc,
};
