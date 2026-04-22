import type { BoLocKhoaHoc as BoLocKhoaHocType, GiangVien } from '@/pages/Study/typing';
import { Button, Form, Input, Select, Space } from 'antd';
import { useEffect } from 'react';

interface BoLocKhoaHocProps {
	boLoc: BoLocKhoaHocType;
	danhSachGiangVien: GiangVien[];
	onChange: (nextBoLoc: BoLocKhoaHocType) => Promise<void> | void;
	onReset: () => Promise<void> | void;
}

const BoLocKhoaHoc = ({ boLoc, danhSachGiangVien, onChange, onReset }: BoLocKhoaHocProps) => {
	const [form] = Form.useForm<BoLocKhoaHocType>();

	useEffect(() => {
		form.setFieldsValue(boLoc);
	}, [boLoc, form]);

	const handleFinish = (values: BoLocKhoaHocType) => {
		const nextBoLoc: BoLocKhoaHocType = {
			keyword: values.keyword?.trim() || undefined,
			giangVienId: values.giangVienId || undefined,
			trangThai: values.trangThai || undefined,
			sapXepHocVien: values.sapXepHocVien || undefined,
		};

		void onChange(nextBoLoc);
	};

	const handleReset = () => {
		form.resetFields();
		void onReset();
	};

	return (
		<Form form={form} layout='inline' onFinish={handleFinish} style={{ marginBottom: 16 }}>
			<Form.Item name='keyword' label='Từ khóa'>
				<Input allowClear placeholder='Nhập tên khóa học' style={{ width: 220 }} />
			</Form.Item>

			<Form.Item name='giangVienId' label='Giảng viên'>
				<Select allowClear placeholder='Chọn giảng viên' style={{ width: 220 }}>
					{danhSachGiangVien.map((giangVien) => (
						<Select.Option key={giangVien.id} value={giangVien.id}>
							{giangVien.hoTen}
						</Select.Option>
					))}
				</Select>
			</Form.Item>

			<Form.Item name='trangThai' label='Trạng thái'>
				<Select allowClear placeholder='Chọn trạng thái' style={{ width: 180 }}>
					<Select.Option value='DANG_MO'>Đang mở</Select.Option>
					<Select.Option value='DA_KET_THUC'>Đã kết thúc</Select.Option>
					<Select.Option value='TAM_DUNG'>Tạm dừng</Select.Option>
				</Select>
			</Form.Item>

			<Form.Item name='sapXepHocVien' label='Sắp xếp'>
				<Select allowClear placeholder='Số lượng học viên' style={{ width: 220 }}>
					<Select.Option value='ASC'>Tăng dần</Select.Option>
					<Select.Option value='DESC'>Giảm dần</Select.Option>
				</Select>
			</Form.Item>

			<Form.Item>
				<Space style={{ marginTop: 10 }}>
					<Button htmlType='submit' type='primary'>
						Áp dụng
					</Button>
					<Button onClick={handleReset}>Reset bộ lọc</Button>
				</Space>
			</Form.Item>
		</Form>
	);
};

export default BoLocKhoaHoc;
