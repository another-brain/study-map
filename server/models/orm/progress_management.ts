import { mysqlEnum, mysqlTable, primaryKey, timestamp } from 'drizzle-orm/mysql-core';
import { ProjectStateValues, TableName } from '../../consts/db';
import { fields } from './utils';
import { relations } from 'drizzle-orm';
import { resource } from './resource_management';
const { id, name, description, refId } = fields;

export const demand = mysqlTable(TableName.Demand, {
    id,
    name,
    description
});

export const project = mysqlTable(TableName.Project, {
    id,
    name,
    state: mysqlEnum(ProjectStateValues as [string, ...string[]]),
    from: timestamp(),
    to: timestamp()
});

export const task = mysqlTable(TableName.Task, {
    id,
    name,
    projectId: refId(project.id)
});

export const projectsToDemands = mysqlTable(
    TableName.ProjectToDemands,
    {
        projectId: refId(project.id),
        demandId: refId(demand.id)
    },
    table => [primaryKey({ columns: [table.projectId, table.demandId] })]
);

export const projectRelations = relations(project, ({ many }) => ({
    tasks: many(task),
    demands: many(projectsToDemands)
}));

export const taskToResources = mysqlTable(
    TableName.TaskToResources,
    {
        taskId: refId(task.id),
        resourceId: refId(resource.id)
    },
    table => [primaryKey({ columns: [table.taskId, table.resourceId] })]
);

export const taskRelations = relations(task, ({ one, many }) => ({
    project: one(project),
    resources: many(taskToResources)
}));
