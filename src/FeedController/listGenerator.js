/**
 * Generator function that returns only some of the items
 * of the provided array every time it's called. This helps create
 * a lazy load functionality.
 * 
 * @param {Array} list 
 * @param {Int} count 
 */
function* listGenerator(list, count = 1) {
    count = count > list.length ? list.length : count;
    let start = 0;
    let end = count;

    while (true) {
        if (end > list.length) {
            yield list.slice(start, list.length);
            break;
        }
        else {
            yield list.slice(start, end);
        }

        start = end;
        end += count;
    }
}

export default listGenerator;
