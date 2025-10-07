type Variant = {
  value: string;
  options: string[];
};

type SKU = {
  value: string;
  price: number;
  stock: number;
  image: string;
};

/**
 * Tạo tất cả các SKU có thể từ variants
 * Hoạt động với số lượng variants bất kỳ
 */
function generateSKUs(variants: Variant[]): SKU[] {
  if (variants.length === 0) return [];
  
  // Lấy tất cả các mảng options
  const allOptions = variants.map(v => v.options);
  
  // Tính cartesian product (tích Descartes)
  function cartesianProduct(arrays: string[][]): string[][] {
    return arrays.reduce((acc, curr) => {
      return acc.flatMap(a => curr.map(b => [...a, b]));
    }, [[]] as string[][]);
  }
  
  // Tạo tất cả các tổ hợp
  const combinations = cartesianProduct(allOptions);
  
  // Chuyển đổi thành SKU objects
  return combinations.map(combo => ({
    value: combo.join('-'),
    price: 0,
    stock: 100,
    image: ''
  }));
}

// // Test với 2 variants
// const variants: Variant[] = [
//   {
//     value: 'Màu sắc',
//     options: ['Đen', 'Trắng', 'Xanh', 'Tím'],
//   },
//   {
//     value: 'Kích thước',
//     options: ['S', 'M', 'L', 'XL'],
//   }
// ];

// const skus = generateSKUs(variants);
// console.log('Kết quả với 2 variants:');
// console.log(JSON.stringify(skus, null, 2));
// console.log(`Tổng số SKU: ${skus.length}`);

// Test với 3 variants để kiểm tra tính mở rộng
const variants3: Variant[] = [
  {
    value: 'Màu sắc',
    options: ['Đen', 'Trắng'],
  },
  {
    value: 'Kích thước',
    options: ['S', 'M'],
  },
  {
    value: 'Chất liệu',
    options: ['Cotton', 'Polyester'],
  }
];

const skus3 = generateSKUs(variants3);
console.log('\nKết quả với 3 variants:');
console.log(JSON.stringify(skus3, null, 2));
console.log(`Tổng số SKU: ${skus3.length}`);



