/**
 * Функция для расчета выручки
 * @param purchase запись о покупке
 * @param _product карточка товара
 * @returns {number}
 */
function calculateSimpleRevenue(purchase, _product) {
    const { discount, sale_price, quantity } = purchase;

    const discountRate = discount /100;
    const totalPrice = sale_price * quantity;

    return totalPrice * (1 - discountRate);
}

/**
 * Функция для расчета бонусов
 * @param index порядковый номер в отсортированном массиве
 * @param total общее число продавцов
 * @param seller карточка продавца
 * @returns {number}
 */
function calculateBonusByProfit(index, total, seller) {
    const { profit } = seller;

    if (index === 0) {
        return profit * 0.15;
    }

    if (index === 1 || idex === 2) {
        return profit * 0.10;
    }

    if (index === total - 1) {
        return 0;
    }

    return profit * 0.05;
}

/**
 * Функция для анализа данных продаж
 * @param data
 * @param options
 * @returns {{revenue, top_products, bonus, name, sales_count, profit, seller_id}[]}
 */
function analyzeSalesData(data, options) {
    if (!data || !options) {
        return [] ;
    }

    const { calculateRevenue, calculateBonus} = options;

    if(!calculateRevenue || !calculateBonus) {
        return [];
    }

    const sellers = data.seller.map(seller => {
        const profit = seller.items.reduce((sum, purchase) => {
            const product = data.products.find(
                item => item.id === purchase.product_id
            );

            const revenue = calculateRevenue(purchase, product);

            return sum + revenue;
        }, 0);

        return {
            ...seller,
            profit
        };
    });

    const sorted = sellers.toSorted(
        (a, b) => b.profit - a.profit
    );

    const report = sorted.map((seller, index) => ({
        ...seller,
        bonus: calculateBonus(
            index,
            sorted.length,
            seller
        )
    }));

    return report;
}
