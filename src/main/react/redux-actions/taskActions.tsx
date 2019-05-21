
import actionCreatorFactory from 'typescript-fsa';

const actionCreator = actionCreatorFactory();

export const taskActions = {
    loadAllTasks: actionCreator<void>('LOAD_ALL_TASKS'),
}
