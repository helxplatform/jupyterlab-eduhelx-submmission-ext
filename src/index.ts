import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { requestAPI } from './handler';

/**
 * Initialization data for the jupyterlab_eduhelx_submission extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_eduhelx_submission:plugin',
  description: 'A JupyterLab extension tfor submitting assignments in EduHeLx',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension jupyterlab_eduhelx_submission is activated!');

    requestAPI<any>('get-example')
      .then(data => {
        console.log(data);
      })
      .catch(reason => {
        console.error(
          `The jupyterlab_eduhelx_submission server extension appears to be missing.\n${reason}`
        );
      });
  }
};

export default plugin;
