# Plan: Ứng dụng quản lý khóa học trực tuyến (Frontend + Mock)

## Tổng quan

Xây dựng module Quản lý Khóa học theo phạm vi frontend + mock, bám theo tài liệu [YEU_CAU.md](YEU_CAU.md). Module tập trung vào 3 nhóm chức năng chính: danh sách khóa học (tìm kiếm/lọc/sắp xếp), thêm mới/chỉnh sửa, và xóa có điều kiện nghiệp vụ.

Phạm vi triển khai:
- Chỉ triển khai giao diện frontend và luồng xử lý phía client.
- Dữ liệu và API sử dụng mock.
- Không triển khai backend thật, database thật, hay xác thực/phân quyền phía server.

---

## 1. Cấu trúc thư mục

```text
src/
├── pages/Study/
│   ├── typing.d.ts                         # Interfaces chung cho khóa học/giảng viên/filter
│   ├── DanhSachKhoaHoc/
│   │   ├── index.tsx                       # Trang danh sách khóa học (table + thao tác)
│   │   ├── KhoaHocFormModal.tsx            # Form thêm/sửa khóa học
│   │   └── BoLocKhoaHoc.tsx                # Tìm kiếm + lọc + sắp xếp
│   └── components/
│       ├── TrangThaiTag.tsx                # Hiển thị tag trạng thái
│       └── ConfirmDeleteModal.tsx          # Hộp thoại xác nhận xóa
│
├── models/study/
│   ├── khoaHoc.ts                          # useInitModel<KhoaHoc> + CRUD + business validations
│   └── giangVien.ts                        # Model lấy danh sách giảng viên mock
│
├── services/Study/
│   ├── khoaHoc.ts                          # API mock: list/create/update/delete khóa học
│   └── giangVien.ts                        # API mock: danh sách giảng viên
│
mock/
└── Study/
    └── Study.ts                            # Mock APIs + dữ liệu mẫu khóa học/giảng viên

config/
└── routes.ts                               # Khai báo route cho module Study
```

---

## 2. Interfaces (typing.d.ts)

```typescript
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
```

---

## 3. Mock API (mock/Study/Study.ts)

### Endpoints

| Method | URL | Mô tả |
|--------|-----|------|
| GET | /api/giang-vien | Lấy danh sách giảng viên |
| GET | /api/khoa-hoc | Lấy danh sách khóa học (hỗ trợ query filter/search/sort) |
| POST | /api/khoa-hoc | Tạo mới khóa học |
| PUT | /api/khoa-hoc/:id | Cập nhật khóa học |
| DELETE | /api/khoa-hoc/:id | Xóa khóa học |

### Quy tắc xử lý mock

- Kiểm tra trùng tên khóa học khi tạo mới/chỉnh sửa.
- Chuẩn hóa tên trước khi so sánh trùng bằng trim().
- Từ chối xóa nếu soLuongHocVien > 0.
- Trả thông báo lỗi tiếng Việt để frontend hiển thị trực tiếp.

### Dữ liệu mẫu ban đầu

- 3-5 giảng viên mẫu.
- 10-20 khóa học mẫu, đủ 3 trạng thái: DANG_MO, DA_KET_THUC, TAM_DUNG.

---

## 4. Models

### models/study/khoaHoc.ts

```typescript
// useInitModel + custom methods:
// - searchByName
// - filterByLecturer
// - filterByStatus
// - sortByStudentCount
// - validateDuplicateCourseName
// - validateDeleteCondition
```

### models/study/giangVien.ts

```typescript
// Quản lý danh sách giảng viên cho dropdown form và bộ lọc
```

---

## 5. Chi tiết màn hình

### 5.1 Danh sách khóa học (DanhSachKhoaHoc/index.tsx)

- Hiển thị bảng gồm: ID, Tên khóa học, Giảng viên, Số lượng học viên, Trạng thái, Thao tác.
- Hỗ trợ tìm kiếm theo tên khóa học.
- Hỗ trợ lọc theo giảng viên và trạng thái.
- Hỗ trợ sắp xếp số lượng học viên tăng dần/giảm dần.
- Nút Thêm khóa học mở modal form.
- Mỗi dòng có nút Sửa và Xóa.

### 5.2 Form thêm mới/chỉnh sửa (KhoaHocFormModal.tsx)

Thành phần form:
- Input: Tên khóa học (max 100 ký tự).
- Select: Giảng viên (từ dữ liệu mock).
- InputNumber: Số lượng học viên (>= 0).
- HTML Editor/TextArea: Mô tả khóa học.
- Select: Trạng thái (DANG_MO/DA_KET_THUC/TAM_DUNG).

Quy tắc:
- Không cho submit khi thiếu dữ liệu bắt buộc.
- Không cho submit khi tên khóa học trùng.
- Chỉnh sửa thì nạp dữ liệu sẵn lên form.

### 5.3 Xóa khóa học (ConfirmDeleteModal.tsx)

- Khi bấm xóa: hiển thị xác nhận.
- Nếu soLuongHocVien = 0: cho phép xóa.
- Nếu soLuongHocVien > 0: chặn xóa, hiển thị thông báo không đủ điều kiện.

### 5.4 Bộ lọc và tìm kiếm (BoLocKhoaHoc.tsx)

- Input keyword theo tên khóa học.
- Select giảng viên.
- Select trạng thái.
- Select kiểu sắp xếp học viên.
- Nút reset bộ lọc.

---

## 6. Validation phía frontend

| Trường dữ liệu | Quy tắc | Thông báo |
|---|---|---|
| Tên khóa học | Bắt buộc, tối đa 100 ký tự, không trùng | Tên khóa học là bắt buộc / không được vượt quá 100 ký tự / đã tồn tại |
| Giảng viên | Bắt buộc, thuộc danh sách mock | Vui lòng chọn giảng viên hợp lệ |
| Số lượng học viên | Bắt buộc, số nguyên >= 0 | Số lượng học viên phải là số nguyên không âm |
| Trạng thái | Bắt buộc, thuộc enum | Vui lòng chọn trạng thái hợp lệ |
| Mô tả khóa học | Không bắt buộc | Định dạng mô tả không hợp lệ |

---

## 7. Routes (config/routes.ts)

```typescript
{
  path: '/study',
  name: 'Quản lý khóa học',
  icon: 'BookOutlined',
  routes: [
    {
      name: 'Danh sách khóa học',
      path: '/study/khoa-hoc',
      component: './Study/DanhSachKhoaHoc',
    },
  ],
}
```

Ghi chú: phạm vi hiện tại không yêu cầu RBAC; nếu mở rộng phân quyền sẽ bổ sung access ở bước sau.

---

## 8. Thứ tự triển khai

| Bước | Nội dung | Files |
|------|----------|-------|
| 1 | Tạo interfaces cho khóa học/giảng viên/filter | src/pages/Study/typing.d.ts |
| 2 | Tạo mock API và dữ liệu mẫu | mock/Study/Study.ts |
| 3 | Tạo services cho khóa học và giảng viên | src/services/Study/*.ts |
| 4 | Tạo model khóa học + giảng viên | src/models/study/*.ts |
| 5 | Tạo trang danh sách khóa học | src/pages/Study/DanhSachKhoaHoc/index.tsx |
| 6 | Tạo form modal thêm/sửa khóa học | src/pages/Study/DanhSachKhoaHoc/KhoaHocFormModal.tsx |
| 7 | Tạo bộ lọc + tìm kiếm + sắp xếp | src/pages/Study/DanhSachKhoaHoc/BoLocKhoaHoc.tsx |
| 8 | Tạo modal xác nhận xóa và xử lý điều kiện | src/pages/Study/components/ConfirmDeleteModal.tsx |
| 9 | Thêm route cho module Study | config/routes.ts |
| 10 | Kiểm thử luồng CRUD + filter/search/sort + validation + điều kiện xóa | Toàn module |

---

## 9. Tiêu chí kiểm thử chính

- Danh sách hiển thị đúng dữ liệu mock và đúng cột theo đặc tả.
- Tìm kiếm theo tên hoạt động đúng theo từ khóa.
- Lọc theo giảng viên và trạng thái trả kết quả chính xác.
- Sắp xếp số lượng học viên đúng theo cả 2 chiều.
- Form thêm/sửa chặn đúng các lỗi validation.
- Không thể xóa khóa học có soLuongHocVien > 0.
- Sau thao tác thêm/sửa/xóa, danh sách cập nhật ngay trên UI.

---

## 10. Nguyên tắc kỹ thuật

- Tái sử dụng useInitModel và các component đang có trong dự án.
- Ưu tiên Ant Design: Form, Input, Select, InputNumber, Modal, Table, Tag, Button, Space.
- Toàn bộ dữ liệu chạy qua mock API để dễ chuyển đổi sang backend thật về sau.
- Validation thực hiện ở frontend và đồng bộ thông báo với lỗi mock API.
- Trải nghiệm người dùng ưu tiên thao tác nhanh, thông báo rõ ràng, trạng thái nhất quán.
