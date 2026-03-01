# Instructions to install dependencies and run the project locally

1. Cài packages

```bash
yarn
```

2. Chạy dự án ở http://localhost:5173

```bash
yarn dev
```

# High-level overview of the project structure

- Mọi logic xử lý về carousel sẽ nằm trong thư mục `src/components/carousel`

- File `src/App.tsx` chứa cách setup carousel

# Explanation of how drag (mouse) interactions are implemented

- Sử dụng các events là onPointerDown, onPointerMove, onPointerUp.

- Công thức tính drag distance: (x1 - x)

- onPointerDown: Dùng để xác định toạ độ (chỉ cần toạ độ x) khi click và giữ chuột.

- onPointerMove: Dùng để xác định toạ độ (chỉ cần toạ độ x1) khi giữ chuột và di chuyển.

- onPointerUp:
  - Dùng để xử lý logic khi giữ chuột sau đó thả chuột.
  - Di chuyển đến slide tiếp theo khi Math.abs(x1-x) > 40.
  - Next slide khi x1 < x, Prev slide khi x1 > x.

# Description of how edge cases are handled (e.g. infinite loop, preventing clicks while dragging, pause on hover)

- infinite loop:
  - Clone thêm 2-3 slides để thêm vào đầu và đuôi của danh sách slides.
  - Khi slide cuối cùng trong slide được clone ra xuất hiện khi lướt thì sẽ thực hiện di chuyển vị trí slide đến slide thật (bỏ qua transition để gây ra flicker và jump).
- preventing clicks while dragging
  - Dựa vào drag distance để phân biệt giữa event click và dragging.
  - Nếu Math.abs(x1-x) rất nhỏ (đang lấy là <= 5px) sẽ được tính là event click.
- pause on hover
  - Khi load trang hoặc khi không hover vào carousel sẽ dùng setInteval với time là 3000ms để trigger auto slide
  - Sử dụng event onMouseEnter để clear setInterval.
  - Sử dụng event onMouseLeave để đặt lại setInterval khi bỏ hover carousel
