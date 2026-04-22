import type { GiangVien, KhoaHoc, KhoaHocPayload, TrangThaiKhoaHoc } from '@/pages/Study/typing';
import { Form, Input, InputNumber, Modal, Select } from 'antd';
import { useEffect } from 'react';

interface FormValues {
	tenKhoaHoc: string;
	giangVienId: string;
	soLuongHocVien: number;
	moTaHtml?: string;
	trangThai: TrangThaiKhoaHoc;
}

interface KhoaHocFormModalProps {
	visible: boolean;
	loading?: boolean;
	danhSachGiangVien: GiangVien[];
	khoaHoc?: KhoaHoc;
	onCancel: () => void;
	onSubmit: (payload: KhoaHocPayload, id?: string) => Promise<void> | void;
	validateDuplicateCourseName: (tenKhoaHoc: string, currentId?: string) => Promise<boolean>;
}

const TRANG_THAI_HOP_LE: TrangThaiKhoaHoc[] = ['DANG_MO', 'DA_KET_THUC', 'TAM_DUNG'];

const KhoaHocFormModal = ({
	visible,
	loading,
	danhSachGiangVien,
	khoaHoc,
	onCancel,
	onSubmit,
	validateDuplicateCourseName,
}: KhoaHocFormModalProps) => {
	const [form] = Form.useForm<FormValues>();

	useEffect(() => {
		if (!visible) {
			form.resetFields();
			return;
		}

		form.setFieldsValue({
			tenKhoaHoc: khoaHoc?.tenKhoaHoc,
			giangVienId: khoaHoc?.giangVienId,
			soLuongHocVien: khoaHoc?.soLuongHocVien,
			moTaHtml: khoaHoc?.moTaHtml,
			trangThai: khoaHoc?.trangThai,
		});
	}, [visible, khoaHoc, form]);

	const handleFinish = (values: FormValues) => {
		const payload: KhoaHocPayload = {
			tenKhoaHoc: values.tenKhoaHoc.trim(),
			giangVienId: values.giangVienId,
			soLuongHocVien: Number(values.soLuongHocVien),
			moTaHtml: values.moTaHtml || '',
			trangThai: values.trangThai,
		};

		void onSubmit(payload, khoaHoc?.id);
	};

	return (
		<Modal
			destroyOnClose
			title={khoaHoc ? 'Chỉnh sửa khóa học' : 'Thêm khóa học mới'}
			visible={visible}
			onCancel={onCancel}
			onOk={() => form.submit()}
			confirmLoading={loading}
			okText='Lưu'
			cancelText='Hủy'
		>
			<Form<FormValues> form={form} layout='vertical' onFinish={handleFinish}>
				<Form.Item
					name='tenKhoaHoc'
					label='Tên khóa học'
					validateTrigger={['onBlur']}
					rules={[
						{ required: true, message: 'Tên khóa học là bắt buộc' },
						{ max: 100, message: 'Tên khóa học không được vượt quá 100 ký tự' },
						{
							validator: async (_, value: string) => {
								if (!value?.trim()) return Promise.resolve();
								const duplicated = await validateDuplicateCourseName(value, khoaHoc?.id);
								if (duplicated) return Promise.reject(new Error('Tên khóa học đã tồn tại'));
								return Promise.resolve();
							},
						},
					]}
				>
					<Input maxLength={100} showCount placeholder='Nhập tên khóa học' />
				</Form.Item>

				<Form.Item
					name='giangVienId'
					label='Giảng viên'
					rules={[
						{
							validator: async (_, value: string) => {
								if (!value) return Promise.reject(new Error('Vui lòng chọn giảng viên hợp lệ'));
								const exists = danhSachGiangVien.some((giangVien) => giangVien.id === value);
								if (!exists) return Promise.reject(new Error('Vui lòng chọn giảng viên hợp lệ'));
								return Promise.resolve();
							},
						},
					]}
				>
					<Select placeholder='Chọn giảng viên'>
						{danhSachGiangVien.map((giangVien) => (
							<Select.Option key={giangVien.id} value={giangVien.id}>
								{giangVien.hoTen}
							</Select.Option>
						))}
					</Select>
				</Form.Item>

				<Form.Item
					name='soLuongHocVien'
					label='Số lượng học viên'
					rules={[
						{
							validator: async (_, value: number) => {
								if (value === undefined || value === null) {
									return Promise.reject(new Error('Số lượng học viên phải là số nguyên không âm'));
								}
								if (!Number.isInteger(value) || value < 0) {
									return Promise.reject(new Error('Số lượng học viên phải là số nguyên không âm'));
								}
								return Promise.resolve();
							},
						},
					]}
				>
					<InputNumber min={0} precision={0} style={{ width: '100%' }} placeholder='Nhập số lượng học viên' />
				</Form.Item>

				<Form.Item
					name='trangThai'
					label='Trạng thái'
					rules={[
						{
							validator: async (_, value: TrangThaiKhoaHoc) => {
								if (!value || !TRANG_THAI_HOP_LE.includes(value)) {
									return Promise.reject(new Error('Vui lòng chọn trạng thái hợp lệ'));
								}
								return Promise.resolve();
							},
						},
					]}
				>
					<Select placeholder='Chọn trạng thái khóa học'>
						<Select.Option value='DANG_MO'>Đang mở</Select.Option>
						<Select.Option value='DA_KET_THUC'>Đã kết thúc</Select.Option>
						<Select.Option value='TAM_DUNG'>Tạm dừng</Select.Option>
					</Select>
				</Form.Item>

				<Form.Item name='moTaHtml' label='Mô tả khóa học'>
					<Input.TextArea rows={4} placeholder='Nhập mô tả HTML hoặc văn bản mô tả khóa học' />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default KhoaHocFormModal;
