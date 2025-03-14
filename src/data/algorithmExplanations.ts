export const algorithmExplanations = {
  tktt: {
    title: 'Thuật toán tìm kiếm tuần tự',
    description: 'Tìm kiếm tuần tự là thuật toán tìm kiếm cơ bản nhất',
    complexity: {
      time: 'O(n)',
      space: 'O(1)'
    },
    steps: [
      {
        title: 'Khởi tạo',
        content: 'Bắt đầu từ phần tử đầu tiên của mảng'
      },
      {
        title: 'So sánh',
        content: 'So sánh từng phần tử với giá trị cần tìm'
      },
      {
        title: 'Kết thúc',
        content: 'Trả về vị trí nếu tìm thấy, ngược lại trả về -1'
      }
    ],
    examples: [
      {
        input: '[1, 4, 7, 8, 3, 9, 10]',
        target: '7',
        steps: [
          'So sánh 1 với 7',
          'So sánh 4 với 7',
          'So sánh 7 với 7 - Tìm thấy tại vị trí 2'
        ]
      }
    ]
  },
  // Thêm giải thích cho các thuật toán khác tương tự
};
