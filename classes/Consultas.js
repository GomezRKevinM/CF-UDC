export class Consultas{
    static Select(tipo,tabla,campo,id) {
        switch(tipo){
            case "Normal":
                return `SELECT * FROM ${tabla}`
            break
            case "Unico":
                return `SELECT ${campo} FROM ${tabla} WHERE id = ${id}`
            break
            case "Condicion":
                return `SELECT * FROM ${tabla} WHERE ${campo} = ${id}`
        }
    }

    static Insert(tabla,campos){
        const datos = {campos}
        return `INSERT INTO ${tabla} () VALUES ()`
    }

    static Update(tabla,campos,id){
        const datos = {campos}
        return `UPDATE ${tabla} SET ${campos} WHERE id = ${id}`
    }
}