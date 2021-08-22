const DataDsiplayNewTab = require("./DataDsiplayNewTab")
// @ponicode
describe("componentDidUpdate", () => {
    let inst

    beforeEach(() => {
        inst = new DataDsiplayNewTab.default()
    })

    test("0", () => {
        let callFunction = () => {
            inst.componentDidUpdate({ match: { params: { display_id: 1000 } } })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            inst.componentDidUpdate({ match: { params: { display_id: 10 } } })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            inst.componentDidUpdate({ match: { params: { display_id: 1 } } })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            inst.componentDidUpdate(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})
