export interface IDataPoint {
	[key: string]: any
	// time: Date
}

export interface IDAGNode {
	id: string;
	dependencies: IDAGNode[]
	dependents: IDAGNode[]
}

export interface IBaseDataSource extends IDAGNode {
	id: string
	name: string
	points: IDataPoint[]
	get(ind: number): IDataPoint
}

export interface IDirectDataSource extends IBaseDataSource {
	update(pt: IDataPoint | IDataPoint[]): void;
}

export interface IInDirectDataSource extends IBaseDataSource {
	// state: {
	// 	domain: [number, number]
	// },
	transformer: (deps: Array<IBaseDataSource>) => IDataPoint[],
	refresh(): void
}

export interface IDataProvider {
	views: { [name: string]: IInDirectDataSource }
	nodes: { [name: string]: IBaseDataSource }

	update(name: string, pt: IDataPoint | IDataPoint[]);
	update(ds: IDirectDataSource, pt: IDataPoint | IDataPoint[]);
}
