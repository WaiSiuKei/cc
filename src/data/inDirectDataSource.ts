import {IDataPoint, IDirectDataSource, IInDirectDataSource} from "./def";

export class InDirectDataSource implements IInDirectDataSource {
	points: IDataPoint[]
	transformer: (deps: Array<IInDirectDataSource | IDirectDataSource>) => IDataPoint[]
	dependents: IInDirectDataSource[]
	dependencies: Array<IInDirectDataSource | IDirectDataSource>

	id: string
	name: string

	constructor(points = []) {
		this.points = points

		this.dependents = []
		this.dependencies = []
	}

	get(ind: number) {
		return this.points[ind]
	}

	refresh() {
		this.points.length = 0
		this.points = this.transformer(this.dependencies)
	}
}