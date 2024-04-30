    var salesData = [[], [], []]; // 精酿、鸡尾酒、咖啡的销售数据
    var totalQuantity = 0;
    var totalSales = 0;
	var itemNames = [
    // 精酿
    "好嘢菌酸艾尔", "柑橘之梦", "血浓于水", "布雷特野菌酸艾尔", "西莉妹妹西打", "阿瓦达啃大瓜西打", "传统皮尔森", "爆米花拉格",
    // 鸡尾酒
    "「酵」劲菠萝头", "Espresso Martini", "山茶花酸", "Free Bola", "柠叶气泡特调", "桑格利亚", "山茶花嗨啵", "Summer Gin Tonic",
    // 无酒精
    "辣·泰妹", "Non-A Bola"
	];

	var itemPrices = [
    // 精酿
    68, 58, 58, 58, 48, 48, 38, 38,
    // 鸡尾酒
    78, 68, 68, 48, 48, 38, 38, 38,
    // 无酒精
    48, 18
	];


    function changeQuantity(button, change) {
        var inputElement = button.parentElement.querySelector('input[type="number"]');
        var quantity = parseInt(inputElement.value) + change;
        inputElement.value = quantity;
        updateTotalPrice();
    }

    function updateTotalPrice() {
        var total = 0;
        var inputs = document.querySelectorAll('.quantity input[type="number"]');
        var prices = [68, 58, 58, 58, 48, 48, 38, 38, 78, 68, 68, 48, 48, 38, 38, 38, 48, 18]; // 商品价格数组
        for (var i = 0; i < inputs.length; i++) {
            var quantity = parseInt(inputs[i].value);
            total += quantity * prices[i];
        }
        document.getElementById('total').innerText = total.toFixed(2);
    }

    function checkout() {
        var modal = document.getElementById('myModal');
        var modalImg = document.getElementById("img01");
        var span = document.getElementsByClassName("close")[0];

        modal.style.display = "block";
        // 修改图片地址为你的图片地址
        modalImg.src = "1.jpg";

        span.onclick = function() {
            modal.style.display = "none";
        }

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }

        var inputs = document.querySelectorAll('.quantity input[type="number"]');
        var prices = [68, 58, 58, 58, 48, 48, 38, 38, 78, 68, 68, 48, 48, 38, 38, 38, 48, 18]; // 商品价格数组
        for (var i = 0; i < inputs.length; i++) {
            var quantity = parseInt(inputs[i].value);
            var sales = quantity * prices[i];
            var categoryIndex = Math.floor(i / 8); // 商品分类索引
            totalQuantity += quantity;
            totalSales += sales;
            var name = '';
            switch (categoryIndex) {
                case 0:
                    name = '精酿' + (i % 8 + 1);
                    break;
                case 1:
                    name = '鸡尾酒' + (i % 8 + 1);
                    break;
                case 2:
                    name = '无酒精' + (i % 2 + 1);
                    break;
            }
            var existingItem = salesData[categoryIndex].find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity += quantity;
                existingItem.sales += sales;
            } else {
                salesData[categoryIndex].push({
                    name: name,
                    quantity: quantity,
                    sales: sales
                });
            }
            inputs[i].value = '0'; // 清空商品数量
        }
        
        var categoryTitles = ['精酿', '鸡尾酒', '无酒精'];
		// 遍历销售数据
	for (var j = 0; j < salesData.length; j++) {
		var categorySalesData = salesData[j]; // 获取当前类别的销售数据
		var salesTableBody = document.getElementById('sales-table-body-' + (j + 1)); // 获取当前类别的销售数据表格体
		salesTableBody.innerHTML = ''; // 清空表格体内容

		// 遍历当前类别的销售数据
		categorySalesData.forEach(function(item) {
        var itemName = itemNames[j * 8 + categorySalesData.indexOf(item)]; // 根据索引获取商品名称
        var percentage = (item.quantity / totalQuantity) * 100;
        var row = '<tr><td>' + itemName + '</td><td>' + item.quantity + '</td><td>￥' + item.sales.toFixed(2) + '</td><td>' + percentage.toFixed(2) + '%</td></tr>';
        salesTableBody.innerHTML += row;
		});
	}
        document.getElementById('total').innerText = '0.00'; // 清空总价

        // 更新销售总量和总销售额
		document.getElementById('total-quantity').innerText = totalQuantity;
		document.getElementById('total-sales-amount').innerText = '￥' + totalSales.toFixed(2);
		// 更新本地存储数据
		localStorage.setItem('salesData', JSON.stringify(salesData));
		localStorage.setItem('totalQuantity', totalQuantity);
		localStorage.setItem('totalSales', totalSales);
    }

	function clearAll() {
		totalQuantity = 0;
		totalSales = 0; // 将总销售额清零
		salesData = [[], [], []];
		var inputs = document.querySelectorAll('.quantity input[type="number"]');
		for (var i = 0; i < inputs.length; i++) {
			inputs[i].value = '0';
		}
		var salesTableBodies = [document.getElementById('sales-table-body-1'), document.getElementById('sales-table-body-2'), document.getElementById('sales-table-body-3')];
		for (var j = 0; j < salesTableBodies.length; j++) {
			salesTableBodies[j].innerHTML = '';
		}
		document.getElementById('total-quantity').innerText = totalQuantity;
		document.getElementById('total-sales-amount').innerText = '￥0.00'; // 将总销售额更新为0
		document.getElementById('total').innerText = '0.00';
		// 更新本地存储数据
		localStorage.removeItem('salesData');
		localStorage.removeItem('totalQuantity');
		localStorage.removeItem('totalSales');
	}
	
	// Excel表
	function exportToExcel() {
		var wb = XLSX.utils.book_new();
		var ws = XLSX.utils.aoa_to_sheet([
			['商品分类', '商品名称', '销售数量', '销售额', '销售占比']
	]);

    var rowIndex = 1; // 从第二行开始添加商品数据

    salesData.forEach(function(category, categoryIndex) {
        category.forEach(function(item) {
            var itemName = itemNames[categoryIndex * 8 + salesData[categoryIndex].indexOf(item)]; // 获取商品名称
            var percentage = (item.quantity / totalQuantity) * 100;
            XLSX.utils.sheet_add_aoa(ws, [
                [categoryIndex === 0 ? '精酿' : (categoryIndex === 1 ? '鸡尾酒' : '无酒精'), itemName, item.quantity, '￥' + item.sales.toFixed(2), percentage.toFixed(2) + '%']
            ], { origin: rowIndex });
            rowIndex++;
        });
    });

    // 添加总销量和总销售额
    rowIndex += 2;
    XLSX.utils.sheet_add_aoa(ws, [
        ['总销量', totalQuantity],
        ['总销售额', '￥' + totalSales.toFixed(2)]
    ], { origin: rowIndex });

    XLSX.utils.book_append_sheet(wb, ws, '销售数据');

    // 导出Excel文件
    XLSX.writeFile(wb, '销售数据.xlsx');
	}

	window.onload = function() {
    // 检查本地存储是否有保存的数据
    if (localStorage.getItem('salesData')) {
        salesData = JSON.parse(localStorage.getItem('salesData'));
        totalQuantity = parseInt(localStorage.getItem('totalQuantity'));
        totalSales = parseFloat(localStorage.getItem('totalSales'));
        
        // 更新销售数据表格
        updateSalesData();

        // 更新总销售数量和总销售额
        document.getElementById('total-quantity').innerText = totalQuantity;
        document.getElementById('total-sales-amount').innerText = '￥' + totalSales.toFixed(2);
		}
	};