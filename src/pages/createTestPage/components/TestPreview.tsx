import React, {FC} from 'react'
import {ITestListItem} from 'types/testsTypes'
import {questionType} from 'constant/common'

interface TestPreviewListProps {
  testList: Array<ITestListItem>
  deleteTest: (id: string) => void
}

const TestPreview: FC<TestPreviewListProps> = ({testList, deleteTest}) => {
  return (
    <form className="create-test create-test__form">
      {testList.map(el => (
        <div key={el.id} className="question-card test-card question-card__mb">
          <button className="question-card__delete delete" onClick={() => deleteTest(el.id)}>&#10007;</button>
          <h3 className="question-card__title">{el.question}</h3>
          <span className="question-card__subtitle">Answer options</span>
          <hr className="question-card__hr"/>
          <ul className="question-card__answers">
            {el.type === questionType.TEXT_ANSWER && (
              <li
                key={el.answer}
                className="question-card__answers-item">
                {el.answer} {el.answer && <span>&#10004;</span>}
              </li>
            )}
            {el.answerOptions.map(item => (
              <li
                key={item.id}
                className="question-card__answers-item"
              >
                {item.answerText} {el.answers?.includes(item.id) && <span>&#10004;</span>}{item.id === el.answer && <span>&#10004;</span>}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </form>
  )
}

export default TestPreview
