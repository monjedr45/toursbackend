 // console.log(req.query);
        // //! build query
        // // 1) filtering
        // const queryObj = { ...req.query }
        // const excludedFields = ['page', 'sort', 'limit', 'fields']
        // excludedFields.forEach(field => delete queryObj[field])

        // // 2) advanced filtering
        // //{ difficulty: 'easy', duration: { gte: '5' } }
        // //{ difficulty: 'easy', duration: { $gte: '5' } }
        // let queryString = JSON.stringify(queryObj)

        // //! regular expression
        // queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
        // let query = Tour.find(JSON.parse(queryString))

        // const query =  Tour.find()
        //     .where('duration').equals(5)
        //     .where('difficulty').equals('easy')

        //! 3) sorting
        // if (req.query.sort) {
        //     const sortBy = req.query.sort.split(',').join(' ')
        //     console.log(sortBy);
        //     query = query.sort(sortBy)
        //     //sort('price ratingsAverage')
        // } else {
        //     query = query.sort('-createdAt')
        // }
        //! 4)) fields limiting  
        // if (req.query.fields) {
        //     const fields = req.query.fields.split(',').join(' ')
        //     query = query.select(fields)
        // } else {
        //     query = query.select('-__v')
        // }

        //! 5) pagination limit
        // const page = req.query.page * 1 || 1
        // const limit = req.query.limit * 1 || 100
        // const skip = (page - 1) * limit
        // console.log(skip);
        // query = query.skip(skip).limit(limit)

        // if (req.query.page) {
        //     const tourNumber = await Tour.countDocuments()
        //     if (skip >= tourNumber) throw new Error('This page is not exist')
        // }
