import type { BoLocKhoaHoc as BoLocKhoaHocType, KhoaHoc, KhoaHocPayload } from '@/pages/Study/typing';
import { Button, Card, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import TrangThaiTag from '../components/TrangThaiTag';
import BoLocKhoaHoc from './BoLocKhoaHoc';
import KhoaHocFormModal from './KhoaHocFormModal';

const DanhSachKhoaHocPage = () => {
	const {
		danhSach,
		loading,
		boLoc,
		applyBoLocModel,
		resetBoLoc,
		getDanhSachKhoaHocModel,
		taoKhoaHocModel,
		capNhatKhoaHocModel,
		xoaKhoaHocModel,
		validateDuplicateCourseName,
	} = useModel('study.khoaHoc');

	const { danhSachGiangVien, getDanhSachGiangVienModel } = useModel('study.giangVien');

	const [visibleForm, setVisibleForm] = useState<boolean>(false);
	const [formLoading, setFormLoading] = useState<boolean>(false);
	const [khoaHocDangSua, setKhoaHocDangSua] = useState<KhoaHoc | undefined>(undefined);
	const [visibleDelete, setVisibleDelete] = useState<boolean>(false);
	const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
	const [khoaHocCanXoa, setKhoaHocCanXoa] = useState<KhoaHoc | undefined>(undefined);

	useEffect(() => {
		void getDanhSachKhoaHocModel();
		void getDanhSachGiangVienModel();
	}, []);

	const columns: ColumnsType<KhoaHoc> = [
		{
			title: 'ID khóa học',
			dataIndex: 'id',
			width: 120,
		},
		{
			title: 'Tên khóa học',
			dataIndex: 'tenKhoaHoc',
		},
		{
			title: 'Giảng viên',
			dataIndex: 'tenGiangVien',
			width: 220,
		},
		{
			title: 'Số lượng học viên',
			dataIndex: 'soLuongHocVien',
			width: 180,
			align: 'right',
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			width: 150,
			render: (trangThai) => <TrangThaiTag trangThai={trangThai} />,
		},
		{
			title: 'Thao tác',
			key: 'actions',
			width: 160,
			align: 'center',
			render: (_, record) => (
				<Space>
					<Button
						type='link'
						onClick={() => {
							setKhoaHocDangSua(record);
							setVisibleForm(true);
						}}
					>
						Sửa
					</Button>
					<Button
						type='link'
						danger
						onClick={() => {
							setKhoaHocCanXoa(record);
							setVisibleDelete(true);
						}}
					>
						Xóa
					</Button>
				</Space>
			),
		},
	];

	const handleChangeBoLoc = async (nextBoLoc: BoLocKhoaHocType) => {
		await applyBoLocModel(nextBoLoc);
	};

	const handleResetBoLoc = async () => {
		await resetBoLoc();
	};

	const handleSaveKhoaHoc = async (payload: KhoaHocPayload, id?: string) => {
		setFormLoading(true);
		try {
			if (id) await capNhatKhoaHocModel(id, payload);
			else await taoKhoaHocModel(payload);

			setVisibleForm(false);
			setKhoaHocDangSua(undefined);
		} catch (error) {
			// Error notification is handled in model/api interceptor.
		} finally {
			setFormLoading(false);
		}
	};

	const handleDeleteKhoaHoc = async (khoaHoc: KhoaHoc) => {
		setDeleteLoading(true);
		try {
			await xoaKhoaHocModel(khoaHoc);
			setVisibleDelete(false);
			setKhoaHocCanXoa(undefined);
		} catch (error) {
			// Error notification is handled in model/api interceptor.
		} finally {
			setDeleteLoading(false);
		}
	};

	return (
		<Card
			title='Danh sách khóa học'
			extra={
				<Space>
					<Button
						onClick={() => {
							void getDanhSachKhoaHocModel(boLoc);
						}}
					>
						Tải lại
					</Button>
					<Button
						type='primary'
						onClick={() => {
							setKhoaHocDangSua(undefined);
							setVisibleForm(true);
						}}
					>
						Thêm khóa học
					</Button>
				</Space>
			}
		>
			<BoLocKhoaHoc
				boLoc={boLoc}
				danhSachGiangVien={danhSachGiangVien}
				onChange={handleChangeBoLoc}
				onReset={handleResetBoLoc}
			/>

			<Table<KhoaHoc>
				rowKey='id'
				columns={columns}
				dataSource={danhSach}
				loading={loading}
				pagination={{ pageSize: 10, showSizeChanger: false }}
				scroll={{ x: 1000 }}
			/>

			<KhoaHocFormModal
				visible={visibleForm}
				loading={formLoading}
				danhSachGiangVien={danhSachGiangVien}
				khoaHoc={khoaHocDangSua}
				onCancel={() => {
					setVisibleForm(false);
					setKhoaHocDangSua(undefined);
				}}
				onSubmit={handleSaveKhoaHoc}
				validateDuplicateCourseName={validateDuplicateCourseName}
			/>

			<ConfirmDeleteModal
				visible={visibleDelete}
				loading={deleteLoading}
				khoaHoc={khoaHocCanXoa}
				onCancel={() => {
					setVisibleDelete(false);
					setKhoaHocCanXoa(undefined);
				}}
				onConfirm={handleDeleteKhoaHoc}
			/>
		</Card>
	);
};

export default DanhSachKhoaHocPage;
