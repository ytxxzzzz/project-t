import {TaskListPage} from './tasklist'
import {connect} from 'react-redux'
import {Dispatch} from 'redux'
import {taskBoardActions} from '../redux-actions/taskBoardActions'
import {TaskBoardState} from '../redux-state/taskBoardState'

export class ActionDispatcher {
  constructor(private dispatch: (action: ReduxAction) => void) {}

  public increment(amount: number) {
    this.dispatch(incrementAmount(amount))
  }

  public decrement(amount: number) {
    this.dispatch(decrementAmount(amount))
  }
}

export default connect(
  (state: ReduxState) => ({value: state.counter}), // ①
  (dispatch: Dispatch<ReduxAction>) => ({actions: new ActionDispatcher(dispatch)}) // ②
)(Counter)