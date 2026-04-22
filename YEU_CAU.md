# ĐẶC TẢ FRONTEND VÀ MOCK

## 1. Phạm vi thực hiện

### 1.1 Mục tiêu
Xây dựng giao diện quản lý khóa học trực tuyến, dữ liệu sử dụng hoàn toàn từ mock.

### 1.2 Giới hạn phạm vi
- Chỉ thực hiện phần frontend (màn hình, biểu mẫu, tương tác người dùng).
- Chỉ sử dụng mock API/mock data để mô phỏng dữ liệu.
- Không triển khai backend thật.
- Không triển khai cơ sở dữ liệu thật.
- Không triển khai xác thực/phân quyền phía server.

### 1.3 Đối tượng sử dụng
- Nhân viên quản trị/vận hành nội dung đào tạo.
- Giảng viên hoặc bộ phận đào tạo cần cập nhật thông tin khóa học.

## 2. Mô hình dữ liệu mock

### 2.1 Đối tượng khóa học
Mỗi khóa học gồm các trường:

- id: string
- tenKhoaHoc: string
- giangVienId: string
- tenGiangVien: string
- soLuongHocVien: number
- moTaHtml: string
- trangThai: "DANG_MO" | "DA_KET_THUC" | "TAM_DUNG"

### 2.2 Danh sách giảng viên mock
Mỗi giảng viên gồm:

- id: string
- hoTen: string

### 2.3 Enum trạng thái hiển thị
- DANG_MO: Đang mở
- DA_KET_THUC: Đã kết thúc
- TAM_DUNG: Tạm dừng

## 3. Màn hình và chức năng frontend

### 3.1 Màn hình danh sách khóa học
Hiển thị bảng danh sách gồm các cột:

- ID khóa học
- Tên khóa học
- Giảng viên
- Số lượng học viên
- Trạng thái
- Hành động (Sửa, Xóa)

Tương tác bắt buộc:

- Tìm kiếm theo tên khóa học (theo từ khóa nhập vào).
- Lọc theo giảng viên.
- Lọc theo trạng thái.
- Sắp xếp theo số lượng học viên (tăng dần/giảm dần).

### 3.2 Form thêm mới/chỉnh sửa khóa học
Biểu mẫu gồm:

- Tên khóa học (tối đa 100 ký tự).
- Giảng viên (dropdown từ dữ liệu giảng viên mock).
- Số lượng học viên.
- Mô tả khóa học (nhập HTML).
- Trạng thái khóa học (chọn từ enum).

Yêu cầu hành vi:

- Dùng chung một form cho thêm mới và chỉnh sửa.
- Với chỉnh sửa, dữ liệu cũ phải được điền sẵn.
- Sau khi lưu thành công, danh sách cập nhật ngay trên UI.

### 3.3 Xóa khóa học
Hành vi xóa trên frontend:

- Khi bấm xóa, hiển thị hộp thoại xác nhận.
- Chỉ cho phép xóa khi số lượng học viên bằng 0.
- Nếu số lượng học viên > 0, hiển thị thông báo không đủ điều kiện xóa.

## 4. Quy tắc nghiệp vụ áp dụng trên frontend

### 4.1 Quy tắc dữ liệu bắt buộc
- Không để trống các trường: Tên khóa học, Giảng viên, Số lượng học viên, Trạng thái.
- Tên khóa học tối đa 100 ký tự.
- Số lượng học viên là số nguyên không âm.

### 4.2 Quy tắc trùng tên khóa học
- Không cho phép thêm mới nếu tên khóa học đã tồn tại.
- Không cho phép chỉnh sửa thành tên đã tồn tại ở khóa học khác.
- Khi kiểm tra trùng tên, chuẩn hóa bằng cách cắt khoảng trắng đầu/cuối.

## 5. Validation phía frontend

| Trường dữ liệu | Điều kiện kiểm tra | Thông báo gợi ý |
|---|---|---|
| Tên khóa học | Bắt buộc, tối đa 100 ký tự, không trùng | Tên khóa học là bắt buộc / không được vượt quá 100 ký tự / đã tồn tại |
| Giảng viên | Bắt buộc, phải thuộc danh sách có sẵn | Vui lòng chọn giảng viên hợp lệ |
| Số lượng học viên | Bắt buộc, số nguyên >= 0 | Số lượng học viên phải là số nguyên không âm |
| Trạng thái | Bắt buộc, thuộc enum | Vui lòng chọn trạng thái hợp lệ |
| Mô tả khóa học | Không bắt buộc | Định dạng mô tả không hợp lệ |

## 6. Hợp đồng mock API (đề xuất)

### 6.1 Danh sách endpoint mock
- GET /api/giang-vien: Lấy danh sách giảng viên.
- GET /api/khoa-hoc: Lấy danh sách khóa học.
- POST /api/khoa-hoc: Tạo mới khóa học.
- PUT /api/khoa-hoc/:id: Cập nhật khóa học.
- DELETE /api/khoa-hoc/:id: Xóa khóa học.

### 6.2 Quy ước phản hồi mock
- Thành công: trả về dữ liệu cập nhật để frontend render lại.
- Lỗi validation: trả về mã lỗi và thông điệp tiếng Việt.
- Lỗi xóa không hợp lệ (soLuongHocVien > 0): trả về lỗi nghiệp vụ để frontend hiển thị cảnh báo.

## 7. Luồng thao tác giao diện

### 7.1 Luồng xem danh sách
1. Mở màn hình danh sách khóa học.
2. Frontend gọi mock API để tải danh sách.
3. Người dùng tìm kiếm/lọc/sắp xếp.
4. Bảng hiển thị lại kết quả theo điều kiện hiện tại.

### 7.2 Luồng thêm mới/chỉnh sửa
1. Người dùng mở form thêm mới hoặc chỉnh sửa.
2. Nhập dữ liệu và bấm lưu.
3. Frontend kiểm tra validation tại client.
4. Nếu hợp lệ thì gọi mock API lưu dữ liệu.
5. Thành công: đóng form, cập nhật danh sách, hiển thị thông báo thành công.
6. Thất bại: hiển thị thông báo lỗi phù hợp.

### 7.3 Luồng xóa
1. Người dùng bấm xóa ở một dòng khóa học.
2. Hiển thị hộp thoại xác nhận.
3. Nếu xác nhận, gọi mock API xóa.
4. Nếu đủ điều kiện: xóa thành công và cập nhật danh sách.
5. Nếu không đủ điều kiện: hiển thị thông báo từ mock API.

## 8. Tiêu chí nghiệm thu frontend

### 8.1 Danh sách khóa học
- Hiển thị đầy đủ các cột dữ liệu theo đặc tả.
- Tìm kiếm/lọc/sắp xếp hoạt động đúng với dữ liệu mock.

### 8.2 Form thêm mới/chỉnh sửa
- Không cho lưu khi dữ liệu không hợp lệ.
- Kiểm tra trùng tên hoạt động đúng.
- Lưu thành công thì danh sách cập nhật tức thời.

### 8.3 Xóa khóa học
- Luôn yêu cầu xác nhận trước khi xóa.
- Chỉ xóa được khi số lượng học viên bằng 0.
- Hiển thị thông báo lỗi rõ ràng khi không đủ điều kiện.

## 9. Dữ liệu mock tham khảo

### 9.1 Giảng viên
```json
[
	{ "id": "GV001", "hoTen": "Nguyễn Văn A" },
	{ "id": "GV002", "hoTen": "Trần Thị B" },
	{ "id": "GV003", "hoTen": "Lê Văn C" }
]
```

### 9.2 Khóa học
```json
[
	{
		"id": "KH001",
		"tenKhoaHoc": "Lập trình React cơ bản",
		"giangVienId": "GV001",
		"tenGiangVien": "Nguyễn Văn A",
		"soLuongHocVien": 25,
		"moTaHtml": "<p>Khóa học React dành cho người mới.</p>",
		"trangThai": "DANG_MO"
	},
	{
		"id": "KH002",
		"tenKhoaHoc": "Node.js nâng cao",
		"giangVienId": "GV002",
		"tenGiangVien": "Trần Thị B",
		"soLuongHocVien": 0,
		"moTaHtml": "<p>Khóa học Node.js chuyên sâu.</p>",
		"trangThai": "TAM_DUNG"
	},
	{
		"id": "KH003",
		"tenKhoaHoc": "Cơ sở dữ liệu SQL",
		"giangVienId": "GV003",
		"tenGiangVien": "Lê Văn C",
		"soLuongHocVien": 40,
		"moTaHtml": "<p>Kiến thức SQL từ cơ bản đến nâng cao.</p>",
		"trangThai": "DA_KET_THUC"
	}
]
```

## 10. Ghi chú triển khai
- Ưu tiên trải nghiệm người dùng rõ ràng: thông báo lỗi dễ hiểu, trạng thái thao tác nhất quán.
- Có thể mở rộng thêm phân trang và bộ lọc nâng cao sau khi hoàn thành phạm vi frontend + mock.