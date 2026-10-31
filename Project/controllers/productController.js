function createProductController(Product) {
    if (!Product) {
        throw new Error('Product model is required');
    }

    return {
        async getAll(req, res, next) {
            try {
                const products = await Product.findAll();
                return res.status(200).json({ data: products });
            } catch (error) {
                return next(error);
            }
        },

        async getById(req, res, next) {
            try {
                const product = await Product.findByPk(req.params.id);

                if (!product) {
                    return res.status(404).json({ message: 'Produk tidak ditemukan' });
                }

                return res.status(200).json({ data: product });
            } catch (error) {
                return next(error);
            }
        },

        async create(req, res, next) {
            try {
                if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
                    return res.status(400).json({ message: 'Data produk tidak valid' });
                }

                const product = await Product.create(req.body);
                return res.status(201).json({ data: product });
            } catch (error) {
                return next(error);
            }
        },

        async update(req, res, next) {
            try {
                const product = await Product.findByPk(req.params.id);

                if (!product) {
                    return res.status(404).json({ message: 'Produk tidak ditemukan' });
                }

                if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
                    return res.status(400).json({ message: 'Data produk tidak valid' });
                }

                await product.update(req.body);
                return res.status(200).json({ data: product });
            } catch (error) {
                return next(error);
            }
        },

        async remove(req, res, next) {
            try {
                const product = await Product.findByPk(req.params.id);

                if (!product) {
                    return res.status(404).json({ message: 'Produk tidak ditemukan' });
                }

                await product.destroy();
                return res.status(200).json({ message: 'Produk berhasil dihapus' });
            } catch (error) {
                return next(error);
            }
        }
    };
}

module.exports = createProductController;
