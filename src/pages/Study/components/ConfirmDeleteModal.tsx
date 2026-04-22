import type { KhoaHoc } from '@/pages/Study/typing';
import { Alert, Modal } from 'antd';

interface ConfirmDeleteModalProps {
	visible: boolean;
	loading?: boolean;
	khoaHoc?: KhoaHoc;
	onCancel: () => void;
	onConfirm: (khoaHoc: KhoaHoc) => Promise<void> | void;
}

const ConfirmDeleteModal = ({
	visible,
	loading,
	khoaHoc,
	onCancel,
	onConfirm,
}: ConfirmDeleteModalProps) => {
	const khongDuDieuKienXoa = (khoaHoc?.soLuongHocVien ?? 0) > 0;

	return (
		<Modal
			title='Xác nhận xóa khóa học'
			visible={visible}
			onCancel={onCancel}
			onOk={() => {
				if (khoaHoc) {
					void onConfirm(khoaHoc);
				}
			}}
			confirmLoading={loading}
			okText='Xóa'
			cancelText='Hủy'
			okButtonProps={{ danger: true, disabled: khongDuDieuKienXoa || !khoaHoc }}
		>
			<p>
				Bạn có chắc chắn muốn xóa khóa học <b>{khoaHoc?.tenKhoaHoc ?? '-'}</b>?
			</p>
			{khongDuDieuKienXoa && (
				<Alert
					type='warning'
					showIcon
					message='Không đủ điều kiện xóa'
					description='Khóa học có số lượng học viên lớn hơn 0 nên không thể xóa.'
				/>
			)}
		</Modal>
	);
};

export default ConfirmDeleteModal;
