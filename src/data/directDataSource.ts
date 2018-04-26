import {IDataPoint, IDirectDataSource, IInDirectDataSource} from "./def";

export class DirectDataSource implements IDirectDataSource {
	points: IDataPoint[]
	dependents: IInDirectDataSource[]
	id: string
	name: string

	constructor(points = []) {
		this.points = points

		this.dependents = []
	}

	get(ind: number) {
		return this.points[ind]
	}

	get dependencies() {
		return []
	}

	update(pt: IDataPoint)
	update(pt: IDataPoint[])
	update(pt: any) {
		let arg = Array.isArray(pt) ? pt : [pt]
		let firstItem = this.points[0]
		let lastItem = this.points[this.points.length - 1]

		let firstInQueen = arg[0]
		let lastInQueen = arg[arg.length - 1]

		if (firstInQueen.time > lastItem.time) this.points = this.points.concat(arg)
		else if (lastInQueen.time < firstItem.time) this.points = arg.concat(this.points)
		else this.points = this.points.concat(arg).sort((a, b) => a.time > b.time ? 1 : -1)

		for (let i = 0, len = this.dependents.length; i < len; i++) {
			this.dependents[i].refresh()
		}
	}
}