export const enum TableName {
    Resource = 'resource',
    Source = 'source',
    Address = 'address',
    Demand = 'demand',
    Project = 'project',
    ProjectToDemands = 'project_to_demands',
    Task = 'task',
    TaskToResources = 'task_to_resources',
    Tag = 'tag'
}

export enum ProjectState {
    Todo = 'todo',
    Doing = 'doing',
    Done = 'done'
}

export const ProjectStateValues = Object.values(ProjectState);
