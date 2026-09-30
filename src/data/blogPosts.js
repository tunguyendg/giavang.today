const blogPosts = [
    {
        slug: "tai-sao-gia-vang-sjc-cao-hon-gia-vang-the-gioi",

        title:
            "Tại sao giá vàng SJC cao hơn giá vàng thế giới?",

        description:
            "Giải thích vì sao giá vàng SJC có thể cao hơn giá vàng thế giới sau quy đổi, cách tính mức chênh lệch và những yếu tố cần lưu ý khi so sánh.",

        excerpt:
            "Giá vàng SJC tại Việt Nam có thể chênh lệch đáng kể so với giá vàng thế giới sau khi quy đổi sang VND/lượng. Bài viết này giải thích cách tính và các yếu tố tạo nên mức chênh lệch đó.",

        category: "Kiến thức vàng",

        publishedAt: "2026-09-28",

        updatedAt: "2026-09-28",

        author: {
            name: "Tony Nguyễn",
            slug: "tony-nguyen",
        },

        heroImage:
            "/og/blog/tai-sao-gia-vang-sjc-cao-hon-gia-vang-the-gioi.jpg",

        sections: [
            {
                heading:
                    "Giá vàng thế giới và giá vàng SJC khác nhau như thế nào?",
                paragraphs: [
                    "Giá vàng thế giới thường được niêm yết theo USD trên mỗi troy ounce, trong khi giá vàng SJC tại Việt Nam được niêm yết theo đồng Việt Nam trên mỗi lượng.",
                    "Muốn so sánh hai mức giá này, trước tiên cần quy đổi giá vàng thế giới từ USD/oz sang VND/lượng theo tỷ giá USD/VND.",
                ],
            },

            {
                heading:
                    "Cách quy đổi giá vàng thế giới sang VND/lượng",
                paragraphs: [
                    "Một troy ounce tương đương 31.1034768 gram và một lượng vàng tại Việt Nam tương đương 37.5 gram.",
                    "Sau khi quy đổi đơn vị khối lượng và nhân với tỷ giá USD/VND, ta có thể ước tính giá vàng thế giới tương đương theo VND/lượng.",
                ],
            },

            {
                heading:
                    "Premium SJC là gì?",
                paragraphs: [
                    "Premium SJC là phần chênh lệch giữa giá bán vàng SJC và giá vàng thế giới sau khi đã quy đổi về cùng đơn vị VND/lượng.",
                    "Mức chênh lệch này có thể được thể hiện bằng số tiền tuyệt đối hoặc theo phần trăm so với giá vàng thế giới quy đổi.",
                ],
            },

            {
                heading:
                    "Vì sao giá vàng SJC có thể cao hơn giá vàng thế giới?",
                paragraphs: [
                    "Giá vàng trong nước không chỉ phụ thuộc vào giá vàng quốc tế mà còn chịu ảnh hưởng từ cung cầu trong nước, cơ chế phân phối, chi phí giao dịch và điều kiện của từng thị trường.",
                    "Vì vậy, giá vàng SJC có thể cao hơn hoặc thấp hơn mức giá vàng thế giới sau quy đổi tại từng thời điểm.",
                ],
            },

            {
                heading:
                    "Nên đọc mức chênh lệch SJC như thế nào?",
                paragraphs: [
                    "Mức chênh lệch giúp người dùng hiểu giá vàng trong nước đang giao dịch cách bao xa so với giá vàng thế giới sau quy đổi.",
                    "Tuy nhiên, đây chỉ là một chỉ số tham khảo và không nên được xem riêng lẻ như tín hiệu mua hoặc bán.",
                ],
            },
        ],

        relatedLinks: [
            {
                label: "Giá vàng SJC hôm nay",
                to: "/gia-vang-sjc",
            },
            {
                label:
                    "Quy đổi giá vàng thế giới sang VND/lượng",
                to: "/quy-doi-gia-vang-the-gioi",
            },
            {
                label: "Giá vàng thế giới",
                to: "/gia-vang-the-gioi",
            },
        ],
    },
];

export default blogPosts;