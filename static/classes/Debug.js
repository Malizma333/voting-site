/**
 * Class containing test functions to automate manual testing
 */
export class Debug {
  /**
   * @param {Number} formVoteCount Number of times to vote between two options.
   */
  static simulateBracketVote (formVoteCount) {
    const votingFormEl = document.querySelector('sl-tab-group').querySelector('form')
    const radioGroupEl = votingFormEl.querySelector('sl-radio-group')
    const nextButtonEl = votingFormEl.querySelector('sl-button[type="submit"]')

    for (let i = 0; i < formVoteCount; i++) {
      radioGroupEl.value = ['left', 'right'][Math.floor(Math.random() * 2)]
      votingFormEl.dispatchEvent(new window.SubmitEvent('submit', { submitter: nextButtonEl }))
    }

    radioGroupEl.value = ''
  }
}
