import Sizes from "./Utils/Sizes"
import Time from "./Utils/Time"

export default class Experience
{
    constructor(canvus)
    {
        // Global access
        window.experience = this
        
        // Options
        this.canvus = canvus

        // Setup
        this.sizes = new Sizes()
        this.time = new Time()

        // Sizes resize event
        this.sizes.on('resize', () =>
        {
            this.resize()
        })

        // Time tick event
        this.time.on('tick', () => 
        {
            this.update()
        })
    }

    resize()
    {
        console.log('hi');
    }

    update()
    {

    }
}