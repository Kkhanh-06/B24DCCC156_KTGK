import type { TrangThaiKhoaHoc } from '@/pages/Study/typing';
import { Tag } from 'antd';

const TRANG_THAI_CONFIG: Record<TrangThaiKhoaHoc, { color: string; label: string }> = {
	DANG_MO: { color: 'green', label: 'Đang mở' },
	DA_KET_THUC: { color: 'blue', label: 'Đã kết thúc' },
	TAM_DUNG: { color: 'gold', label: 'Tạm dừng' },
};

interface TrangThaiTagProps {
	trangThai: TrangThaiKhoaHoc;
}

const TrangThaiTag = ({ trangThai }: TrangThaiTagProps) => {
	const config = TRANG_THAI_CONFIG[trangThai];
	return <Tag color={config.color}>{config.label}</Tag>;
};

export default TrangThaiTag;
