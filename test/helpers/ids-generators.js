import uuidv4 from 'uuid/v4'

export function generateIdsUnique(idsCount, idsExisting) {
    if (idsCount === 1 || (!idsCount)) {
        let id = uuidv4()
        while (!idsExisting.indexOf(id) === -1) {
            id = uuidv4()
        }
        return id
    }

    let idsNotExisting = []
    while (idsNotExisting.length < idsCount) {
        let id = uuidv4()
        while (!idsExisting.indexOf(id) === -1) {
            id = uuidv4()
        }
        idsNotExisting.push(id)
    }
    return idsNotExisting
}

export function generateIdInvalid() {
    const idInvalid = uuidv4()
    return idInvalid.slice(0, idInvalid.length - 2)
}
