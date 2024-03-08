import {
  ILayoutRestorer,
  ILabShell,
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application'
import { FileBrowserModel, IDefaultFileBrowser } from '@jupyterlab/filebrowser'
import { Dialog, showErrorMessage } from '@jupyterlab/apputils'
import { IChangedArgs } from '@jupyterlab/coreutils'
import { getServerSettings, IServerSettings } from './api'
import { AssignmentWidget } from './widgets'
import { EduhelxSubmissionModel } from './model'
import { submissionIcon } from './style/icons'
import { IFileBrowserFactory } from '@jupyterlab/filebrowser'

async function activate (
  app: JupyterFrontEnd,
  fileBrowser: IDefaultFileBrowser,
  restorer: ILayoutRestorer,
  shell: ILabShell,
) {
  let serverSettings: IServerSettings
  try {
    serverSettings = await getServerSettings()
  } catch (e: any) {
    console.error('Failed to load the eduhelx_jupyterlab_student extension settings', e)
    showErrorMessage(
      'Failed to load the eduhelx_jupyterlab_student server extension',
      e.message,
      [Dialog.warnButton({ label: 'Dismiss' })]
    )
    return
  }

  // const model = new EduhelxSubmissionModel()
  // Promise.all([app.restored, fileBrowser.model.restored]).then(() => {
  //   model.currentPath = fileBrowser.model.path
  // })
  
  const submissionWidget = new AssignmentWidget(
    fileBrowser,
    app.commands,
    serverSettings
  )
  submissionWidget.id = 'jp-submission-widget'
  submissionWidget.title.icon = submissionIcon
  submissionWidget.title.caption = 'Submit assignments'

  restorer.add(submissionWidget, 'submission-widget')
  shell.add(submissionWidget, 'left', { rank: 200 })
}

/**
 * Initialization data for the eduhelx_jupyterlab_student extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'eduhelx_jupyterlab_student:plugin',
  description: 'A JupyterLab extension tfor submitting assignments in EduHeLx',
  autoStart: true,
  requires: [
    IDefaultFileBrowser,
    ILayoutRestorer,
    ILabShell,
  ],
  activate
};

export default plugin;
