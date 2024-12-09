export const pushPagiation = (pipeline, { limit = 10, page } = {}) =>  {
    const skip = limit * (page <= 0 ? 0 : page-1);

    pipeline.push({
        $facet: {
            // metadata:[{ $count: "total"}, { $addFields: { page: page <= 0 ? 1 : page, limit: limit, pages: 1} } ],
            metadata:[{ $count: "total_items"}, { $addFields: { current_page: page <= 0 ? 1 : page, limit: limit, total_pages: { $ceil : {$divide:["$total_items", limit] }} } }],
            items: [ { $skip: skip }, { $limit: limit } ],
        },
    });

    pipeline.push({ $unwind: "$metadata" });
}


export const aggregate = async (Model, pipeline, { limit = 10, page, paginate:isPaginationActive = false } = {}) =>  {
    if(isPaginationActive !== false) {
        const skip = limit * (page <= 0 ? 0 : page-1);

        pipeline.push({
            $facet: {
                metadata:[{ $count: "total_items"}, { $addFields: { current_page: page <= 0 ? 1 : page, limit: limit, total_pages: { $ceil : {$divide:["$total_items", limit] }} } }],
                items: [ { $skip: skip }, { $limit: limit } ],
            },
        });

        pipeline.push({ $unwind: "$metadata" });
    }
    
    const list = await Model.aggregate(pipeline);

    if(isPaginationActive !== false) {
        return list.first();
    }

    return list;
}



export default { pushPagiation, aggregate }