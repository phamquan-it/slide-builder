# Slide Builder

**Slide Builder** là một công cụ tạo slide hiện đại, dựa trên web, cho phép người dùng thiết kế, chỉnh sửa và xuất bản slide động dưới dạng `.pptx`. Hướng đến giáo dục, sáng tạo và trình bày chuyên nghiệp, Slide Builder tích hợp trình vẽ trên HTML Canvas, quản lý nhiều slide, và hỗ trợ công cụ vẽ ảnh trực tiếp.

Dự án sử dụng [Next.js](https://nextjs.org), [Redux Toolkit](https://redux-toolkit.js.org/), và [PptxGenJS](https://gitbrent.github.io/PptxGenJS/) để cung cấp trải nghiệm xây slide thời gian thực và xuất bản file PowerPoint.

---

## 🚀 Bắt đầu nhanh

Cài đặt thư viện:

```bash
npm install
# hoặc
yarn install
```

Chạy ứng dụng phát triển:

```bash
npm run dev
# hoặc
yarn dev
```

Mở trình duyệt tại [http://localhost:3000](http://localhost:3000) để bắt đầu tạo slide.

---

## 🔧 Cấu trúc dự án

- `app/`: Các route chính sử dụng App Router của Next.js.
- `components/`: Các UI component như thanh công cụ, sidebar, canvas.
- `lib/`: Hàm tiện ích như xuất `.pptx`, quản lý file.
- `redux/`: Slice Redux để quản lý state slide và phần tử.
- `canvas/`: Toàn bộ logic dựng và tương tác canvas.
- `public/`: Tài nguyên tĩnh như icon, hình ảnh mẫu.
- `styles/`: Cấu hình Tailwind CSS và các style tùy chỉnh.

---

## 🌟 Tính năng nổi bật

- 🖼️ **Trình soạn thảo slide dạng canvas**: hỗ trợ kéo-thả phần tử, chỉnh sửa nội dung trực quan.
- 📝 **Thêm nội dung đa dạng**: văn bản, hình ảnh, khối màu, hình khối, lớp nền.
- 🖌️ **Chỉnh sửa hình ảnh trực tiếp** với công cụ vẽ:
  - **Brush Tool**: vẽ tự do trên ảnh.
  - **Pencil Tool**: vẽ nét mảnh chính xác.
  - **Remove Tool**: xoá vùng ảnh theo màu (color masking).
- 🗂️ **Quản lý nhiều slide**: thêm, xóa, sao chép, sắp xếp slide.
- 📤 **Xuất file `.pptx`** dễ dàng với PptxGenJS.
- 🎨 **Chỉnh style phần tử**: font chữ, cỡ, màu sắc, kích thước, xoay, v.v.
- ♻️ **State toàn cục với Redux Toolkit**: đảm bảo đồng bộ mọi thay đổi.

---

## 💡 Công nghệ sử dụng

- **Next.js 14 (App Router)** – framework React fullstack.
- **TypeScript** – giúp phát triển an toàn với kiểu rõ ràng.
- **Redux Toolkit** – quản lý state tập trung và tối ưu.
- **Tailwind CSS** – styling tiện lợi, responsive.
- **PptxGenJS** – xuất slide sang `.pptx`.
- **HTML Canvas API** – xử lý dựng hình và tương tác phần tử.
- **React DnD / `useRef`** – kéo-thả và resize mượt mà.

---

## 📂 Định hướng phát triển

- 🧠 Gợi ý slide tự động bằng AI.
- 🔄 Undo / Redo cho thao tác vẽ và chỉnh sửa.
- ✂️ Brush nâng cao: chọn màu, độ mờ, kích thước.
- 🧾 Nhập nội dung dạng text và chuyển thành slide.
- 📡 Hỗ trợ cộng tác thời gian thực (WebSocket/WebRTC).
- 💾 Lưu lịch sử ảnh đã chỉnh sửa, snapshot từng slide.

---

## 🧪 Gợi ý triển khai

- **Frontend**: triển khai trên Vercel hoặc Node.js server.
- **Lưu trữ**: xuất file `.pptx` cục bộ, hoặc tích hợp cloud (Firebase, Supabase).
- **Backend tùy chọn**: xác thực người dùng, lưu dự án, cộng tác (Laravel, Express).

---

## 📬 Đóng góp

Bạn muốn đóng góp, thêm tính năng hoặc báo lỗi?

Hãy tạo issue hoặc pull request trên GitHub – mọi đóng góp đều được hoan nghênh!

---

**© 2025 – Slide Builder**
