import React, {FC, useContext, useState} from 'react'
import Modal from 'components/Modal'
import {RouteProps} from 'types/routeTypes'
import {ITest, ITestListAnswer, ITestListItem} from 'types/testsTypes'
import QuestionModalOneAnswer from './components/QuestionModalOneAnswer'
import QuestionModalYesOrNo from './components/QuestionModalYesOrNo'
import Loader from 'components/loader/Loader'
import TestPreview from './components/TestPreview'
import useFirestoreSet from 'hooks/useFirestoreSet'
import {ERROR_CREATE_TEST} from 'constant/common'
import {createIdCollection} from 'utiles'
import FloatingButton from 'components/FloatingButton'
import {SettingsSvg} from 'constant/icons'
import SettingsModal from './components/SettingsModal'
import {FirebaseContext} from 'index'
import {APIUrls} from 'constant/api_urls'
import QuestionModalTextAnswer from './components/QuestionModalTextAnswer'
import QuestionModalFewAnswer from './components/QuestionModalFewAnswer';

export const createTestPageId: string = 'create-test'

const CreateTestPage: FC<RouteProps> = ({match}) => {
  const slug: string = match.params.slug
  const {user} = useContext(FirebaseContext)
  const [activeModal, setActiveModal] = useState<boolean>(false)
  const [modalContentId, setModalContentId] = useState<number>(0)
  const [testName, setTestName] = useState<string>('')
  const [testDescription, setTestDescription] = useState<string>('')
  const [testEndDate, setTestEndDate] = useState<string>('')
  const [questionList, setQuestionList] = useState<Array<ITestListItem>>([])
  const {isLoading: isLoadingTest, setDB: setTest, error} = useFirestoreSet(APIUrls.tests)
  const {setDB: setTestAnswer} = useFirestoreSet(APIUrls.testsAnswer)
  const [choseGroups, setChoseGroups] = useState<string>('')
  const [isActiveOnExpiration, setIsActiveOnExpiration] = useState<boolean>(false)

  const onCreateTest = async () => {
    const idDoc = createIdCollection(APIUrls.tests)
    const initialDataTest: ITest = {
      idDoc: idDoc,
      type: slug,
      questions: [],
      forGroup: choseGroups,
      testName,
      testEndDate,
      testDescription,
      whoCreated: user!.uid,
      isActiveOnExpiration,
    }
    const initialDataAnswer: ITestListAnswer = {idDoc: idDoc, answers: []}

    questionList.forEach(question => {
      initialDataAnswer.answers.push({
        question: question.id,
        correctAnswer: question?.answer || 'notOneAnswer',
        correctAnswers: question.answers || []
      })
      initialDataTest.questions.push({
        type: question.type,
        answerOptions: question.answerOptions,
        id: question.id,
        question: question.question
      })
    })

    setTest({body: initialDataTest, idDoc: idDoc})
    setTestAnswer({body: initialDataAnswer, idDoc: idDoc})
    setQuestionList([])
    setTestName('')
    setTestDescription('')
    setTestEndDate('')
  }

  const modalContent = [
    {
      id: 0,
      content: <QuestionModalOneAnswer setTestList={setQuestionList} maxAnswer={30}/>
    },
    {
      id: 1,
      content: <QuestionModalTextAnswer setTestList={setQuestionList}/>
    },
    {
      id: 2,
      content: <QuestionModalFewAnswer maxAnswer={30} setTestList={setQuestionList}/>,
    },
    {
      id: 3,
      content: <QuestionModalYesOrNo setTestList={setQuestionList}/>
    },
    {
      id: 4,
      content: <SettingsModal
        setTestName={setTestName}
        testName={testName}
        setTestDescription={setTestDescription}
        testDescription={testDescription}
        testEndDate={testEndDate}
        setTestEndDate={setTestEndDate}
        setChoseGroups={setChoseGroups}
        onCreateTest={onCreateTest}
        isShowButton={questionList.length > 0}
        setIsActiveOnExpiration={setIsActiveOnExpiration}
        isActiveOnExpiration={isActiveOnExpiration}
      />
    },
  ]

  const showModal = (id: number) => {
    setActiveModal(true)
    setModalContentId(id)
  }

  const deleteQuestion = (id: string) => {
    setQuestionList(prevState => {
      return [...prevState.filter(el => el.id !== id)]
    })
  }

  if (slug === 'multi') return (
    <div>
      <h3>Creating a {slug} test</h3>
      <div className="create-test-page flew-wrapper">
        <Modal active={activeModal} setActive={setActiveModal}>
          {modalContent.filter(e => e.id === modalContentId)[0]?.content}
        </Modal>
        <div className="left-content">
          {!questionList.length && <h4>Start building your test</h4>}
          {questionList.length > 0 && (
            <TestPreview
              testList={questionList}
              deleteTest={deleteQuestion}
            />
          )}
          {isLoadingTest && <Loader/>}
          {error && <strong className="error">{ERROR_CREATE_TEST}: {error?.message}</strong>}
        </div>
        <div className="right-content create-test-bar">
          <button onClick={() => showModal(0)} className="rainbow create-test__button">Question with 1 correct answer</button>
          <button onClick={() => showModal(1)} className="rainbow create-test__button">Question with text answer</button>
          <button onClick={() => showModal(2)} className="rainbow create-test__button">Multiple answer question</button>
          <button onClick={() => showModal(3)} className="rainbow create-test__button">Yes / no question</button>
        </div>
      </div>
      <FloatingButton
        onClick={() => showModal(4)}
        children={<SettingsSvg/>}
      />
    </div>
  )

  return (
    <div>
      <h4>In developing. Choose another test</h4>
    </div>
  )
}

export default CreateTestPage
