import {CodeArtifactAuthProvider, NodePackageManager} from 'projen/lib/javascript'
import {synthSnapshot} from 'projen/lib/util/synth'
import {DeployableAwsCdkTypeScriptApp} from '../src'

const releaseWorkflowFilePath = '.github/workflows/release.yml'
const tasksFilePath = '.projen/tasks.json'
const nvmrcFilePath = '.nvmrc'

describe('No stack pattern', () => {
  const project = new DeployableAwsCdkTypeScriptApp({
    packageManager: NodePackageManager.NPM,
    name: 'my-test-app',
    defaultReleaseBranch: 'main',
    cdkVersion: '1.129.0',
    workflowNodeVersion: '14.18.1',
    deployOptions: {
      environments: [
        {
          name: 'dev',
          awsCredentials: {
            accessKeyIdSecretName: 'dev-secret-1',
            secretAccessKeySecretName: 'dev-secret-2',
            region: 'dev-aws-region-1',
          },
        },
        {
          name: 'staging',
          awsCredentials: {
            accessKeyIdSecretName: 'staging-secret-1',
            secretAccessKeySecretName: 'staging-secret-2',
            region: 'staging-aws-region-1',
          },
        },
      ],
    },
  })
  const synthOutput = synthSnapshot(project)

  test('release workflow', () => {
    expect(synthOutput[releaseWorkflowFilePath]).toMatchSnapshot()
  })
})

describe('specific stack', () => {
  const project = new DeployableAwsCdkTypeScriptApp({
    packageManager: NodePackageManager.NPM,
    name: 'my-test-app',
    defaultReleaseBranch: 'main',
    cdkVersion: '1.129.0',
    generateNvmrc: false,
    deployOptions: {
      stackPattern: 'myStack',
      environments: [
        {
          name: 'dev',
          awsCredentials: {
            accessKeyIdSecretName: 'dev-secret-1',
            secretAccessKeySecretName: 'dev-secret-2',
            region: 'dev-aws-region-1',
          },
        },
      ],
    },
  })
  const synthOutput = synthSnapshot(project)

  test('release workflow', () => {
    expect(synthOutput[releaseWorkflowFilePath]).toMatchSnapshot()
  })

  test('tasks', () => {
    expect(synthOutput[tasksFilePath]).toMatchSnapshot()
  })
})

describe('assume role with default duration', () => {
  const project = new DeployableAwsCdkTypeScriptApp({
    packageManager: NodePackageManager.NPM,
    name: 'my-test-app',
    defaultReleaseBranch: 'main',
    cdkVersion: '1.129.0',
    generateNvmrc: false,
    deployOptions: {
      environments: [
        {
          name: 'dev',
          awsCredentials: {
            accessKeyIdSecretName: 'dev-secret-1',
            secretAccessKeySecretName: 'dev-secret-2',
            region: 'dev-aws-region-1',
            roleToAssume: 'dev-role',
          },
        },
      ],
    },
  })
  const synthOutput = synthSnapshot(project)

  test('release workflow', () => {
    expect(synthOutput[releaseWorkflowFilePath]).toMatchSnapshot()
  })
})

describe('assume role with specified duration', () => {
  const project = new DeployableAwsCdkTypeScriptApp({
    packageManager: NodePackageManager.NPM,
    name: 'my-test-app',
    defaultReleaseBranch: 'main',
    cdkVersion: '1.129.0',
    generateNvmrc: false,
    deployOptions: {
      environments: [
        {
          name: 'dev',
          awsCredentials: {
            accessKeyIdSecretName: 'dev-secret-1',
            secretAccessKeySecretName: 'dev-secret-2',
            region: 'dev-aws-region-1',
            roleToAssume: 'dev-role',
            assumeRoleDurationSeconds: 1200,
          },
        },
      ],
    },
  })
  const synthOutput = synthSnapshot(project)

  test('release workflow', () => {
    expect(synthOutput[releaseWorkflowFilePath]).toMatchSnapshot()
  })
})

describe('nvmrc', () => {
  test('generated by default', () => {
    const project = new DeployableAwsCdkTypeScriptApp({
      packageManager: NodePackageManager.NPM,
      name: 'my-test-app',
      defaultReleaseBranch: 'main',
      cdkVersion: '1.129.0',
      workflowNodeVersion: '14.18.1',
      deployOptions: {
        environments: [
          {
            name: 'dev',
            awsCredentials: {
              accessKeyIdSecretName: 'dev-secret-1',
              secretAccessKeySecretName: 'dev-secret-2',
              region: 'dev-aws-region-1',
            },
          },
        ],
      },
    })
    const synthOutput = synthSnapshot(project)

    expect(synthOutput[nvmrcFilePath]).toBe('14.18.1')
  })

  test('does not get generated if set to', () => {
    const project = new DeployableAwsCdkTypeScriptApp({
      packageManager: NodePackageManager.NPM,
      name: 'my-test-app',
      defaultReleaseBranch: 'main',
      cdkVersion: '1.129.0',
      workflowNodeVersion: '14.18.1',
      generateNvmrc: false,
      deployOptions: {
        environments: [
          {
            name: 'dev',
            awsCredentials: {
              accessKeyIdSecretName: 'dev-secret-1',
              secretAccessKeySecretName: 'dev-secret-2',
              region: 'dev-aws-region-1',
            },
          },
        ],
      },
    })
    const synthOutput = synthSnapshot(project)

    expect(synthOutput[nvmrcFilePath]).toBeUndefined()
  })

  test('defaults the node version where generate Nvmrc is true', ()=> {
    const project = new DeployableAwsCdkTypeScriptApp({
      packageManager: NodePackageManager.NPM,
      name: 'my-test-app',
      defaultReleaseBranch: 'main',
      cdkVersion: '1.129.0',
      deployOptions: {
        environments: [
          {
            name: 'dev',
            awsCredentials: {
              accessKeyIdSecretName: 'dev-secret-1',
              secretAccessKeySecretName: 'dev-secret-2',
              region: 'dev-aws-region-1',
            },
          },
        ],
      },
    })
    const synthOutput = synthSnapshot(project)

    expect(synthOutput[nvmrcFilePath]).toBe('14.18.1')
  })
})

describe('environment added by invoking the addEnvironments', () => {
  const project = new DeployableAwsCdkTypeScriptApp({
    packageManager: NodePackageManager.NPM,
    name: 'my-test-app',
    defaultReleaseBranch: 'main',
    cdkVersion: '1.129.0',
    workflowNodeVersion: '14.18.1',
    deployOptions: {
      environments: [
      ],
    },
  })
  project.addEnvironments({
    name: 'dev',
    awsCredentials: {
      accessKeyIdSecretName: 'dev-secret-1',
      secretAccessKeySecretName: 'dev-secret-2',
      region: 'dev-aws-region-1',
    },
  },
  {
    name: 'staging',
    awsCredentials: {
      accessKeyIdSecretName: 'staging-secret-1',
      secretAccessKeySecretName: 'staging-secret-2',
      region: 'staging-aws-region-1',
    },
  })
  const synthOutput = synthSnapshot(project)

  test('release workflow', () => {
    expect(synthOutput[releaseWorkflowFilePath]).toMatchSnapshot()
  })
})

describe('npm config set for each environments', () => {
  const project = new DeployableAwsCdkTypeScriptApp({
    packageManager: NodePackageManager.NPM,
    name: 'my-test-app',
    defaultReleaseBranch: 'main',
    cdkVersion: '1.129.0',
    workflowNodeVersion: '14.18.1',
    deployOptions: {
      npmConfigEnvironment: 'stage',
      environments: [{
        name: 'dev',
        awsCredentials: {
          accessKeyIdSecretName: 'dev-secret-1',
          secretAccessKeySecretName: 'dev-secret-2',
          region: 'dev-aws-region-1',
        },
      },
      {
        name: 'staging',
        awsCredentials: {
          accessKeyIdSecretName: 'staging-secret-1',
          secretAccessKeySecretName: 'staging-secret-2',
          region: 'staging-aws-region-1',
        },
      }],
    },
  })

  const synthOutput = synthSnapshot(project)

  test('release workflow', () => {
    expect(synthOutput[releaseWorkflowFilePath]).toMatchSnapshot()
  })

  test('deploy:workflow task should have requiredEnv', () => {
    expect(synthOutput[tasksFilePath].tasks['deploy:workflow']).toMatchSnapshot()
  })
})

describe('set the checkActiveDeployment flag', () => {
  const project = new DeployableAwsCdkTypeScriptApp({
    packageManager: NodePackageManager.NPM,
    name: 'my-test-app',
    defaultReleaseBranch: 'main',
    cdkVersion: '1.129.0',
    workflowNodeVersion: '14.18.1',
    checkActiveDeployment: true,
    deployOptions: {
      environments: [{
        name: 'dev',
        awsCredentials: {
          accessKeyIdSecretName: 'dev-secret-1',
          secretAccessKeySecretName: 'dev-secret-2',
          region: 'dev-aws-region-1',
        },
      }],
    },
  })

  const synthOutput = synthSnapshot(project)

  test('release workflow', () => {
    expect(synthOutput[releaseWorkflowFilePath]).toMatchSnapshot()
  })
})

describe('a new task added for deployment in workflow', () => {
  const project = new DeployableAwsCdkTypeScriptApp({
    packageManager: NodePackageManager.NPM,
    name: 'my-test-app',
    defaultReleaseBranch: 'main',
    cdkVersion: '1.129.0',
    workflowNodeVersion: '14.18.1',
    deployOptions: {
      environments: [{
        name: 'dev',
        awsCredentials: {
          accessKeyIdSecretName: 'dev-secret-1',
          secretAccessKeySecretName: 'dev-secret-2',
          region: 'dev-aws-region-1',
        },
      }],
    },
  })

  const synthOutput = synthSnapshot(project)

  test('tasks', () => {
    expect(synthOutput[tasksFilePath]).toMatchSnapshot()
  })
})

describe('deploy option method is specified', () => {
  const project = new DeployableAwsCdkTypeScriptApp({
    packageManager: NodePackageManager.NPM,
    name: 'my-test-app',
    defaultReleaseBranch: 'main',
    cdkVersion: '1.129.0',
    workflowNodeVersion: '14.18.1',
    deployOptions: {
      method: 'direct',
      environments: [{
        name: 'dev',
        awsCredentials: {
          accessKeyIdSecretName: 'dev-secret-1',
          secretAccessKeySecretName: 'dev-secret-2',
          region: 'dev-aws-region-1',
        },
      }],
    },
  })

  const synthOutput = synthSnapshot(project)

  test('tasks', () => {
    expect(synthOutput[tasksFilePath].tasks['deploy:workflow']).toMatchSnapshot()
  })
})

describe('post deployment added in workflow', () => {
  const project = new DeployableAwsCdkTypeScriptApp({
    packageManager: NodePackageManager.NPM,
    name: 'my-test-app',
    defaultReleaseBranch: 'main',
    cdkVersion: '1.129.0',
    workflowNodeVersion: '14.18.1',
    deployOptions: {
      environments: [
        {
          name: 'dev1',
          postDeployWorkflowScript: 'post-deploy',
          awsCredentials: {
            accessKeyIdSecretName: 'dev-secret-1',
            secretAccessKeySecretName: 'dev-secret-2',
            region: 'dev-aws-region-1',
          },
        },
        {
          name: 'dev2',
          awsCredentials: {
            accessKeyIdSecretName: 'dev-secret-3',
            secretAccessKeySecretName: 'dev-secret-4',
            region: 'dev-aws-region-2',
          },
        },
      ],
    },
  })

  const synthOutput = synthSnapshot(project)

  test('release workflow', () => {
    expect(synthOutput[releaseWorkflowFilePath]).toMatchSnapshot()
  })
})

describe('pre deployment added in workflow', () => {
  const project = new DeployableAwsCdkTypeScriptApp({
    packageManager: NodePackageManager.NPM,
    name: 'my-test-app',
    defaultReleaseBranch: 'main',
    cdkVersion: '1.129.0',
    workflowNodeVersion: '14.18.1',
    deployOptions: {
      environments: [
        {
          name: 'dev1',
          preDeployWorkflowScript: 'pre-deploy',
          awsCredentials: {
            accessKeyIdSecretName: 'dev-secret-1',
            secretAccessKeySecretName: 'dev-secret-2',
            region: 'dev-aws-region-1',
          },
        },
        {
          name: 'dev2',
          awsCredentials: {
            accessKeyIdSecretName: 'dev-secret-3',
            secretAccessKeySecretName: 'dev-secret-4',
            region: 'dev-aws-region-2',
          },
        },
      ],
    },
  })

  const synthOutput = synthSnapshot(project)

  test('tasks', () => {
    expect(synthOutput[releaseWorkflowFilePath]).toMatchSnapshot()
  })
})

describe('pre install added in workflow', () => {
  const project = new DeployableAwsCdkTypeScriptApp({
    packageManager: NodePackageManager.NPM,
    name: 'my-test-app',
    defaultReleaseBranch: 'main',
    cdkVersion: '1.129.0',
    workflowNodeVersion: '14.18.1',
    deployOptions: {
      taskToRunPreInstall: 'stub-task',
      environments: [
        {
          name: 'dev1',
          awsCredentials: {
            accessKeyIdSecretName: 'dev-secret-1',
            secretAccessKeySecretName: 'dev-secret-2',
            region: 'dev-aws-region-1',
          },
        },
      ],
    },
  })

  const synthOutput = synthSnapshot(project)

  test('tasks', () => {
    expect(synthOutput[releaseWorkflowFilePath]).toMatchSnapshot()
  })
})

describe('scoped packages exists', () => {
  const project = new DeployableAwsCdkTypeScriptApp({
    packageManager: NodePackageManager.NPM,
    name: 'my-test-app',
    defaultReleaseBranch: 'main',
    cdkVersion: '1.129.0',
    scopedPackagesOptions: [
      {
        registryUrl: 'https://my-domain-111122223333.d.codeartifact.us-west-2.amazonaws.com/npm/my_repo/',
        scope: '@blah',
      },
    ],
    codeArtifactOptions: {
      roleToAssume: 'stub-role-1',
    },
    deployOptions: {
      environments: [
        {
          name: 'dev1',
          awsCredentials: {
            roleToAssume: 'stub-role-2',
            region: 'dev-aws-region-1',
          },
        },
      ],
    },
  })

  const synthOutput = synthSnapshot(project)

  test('release workflow', () => {
    expect(synthOutput[releaseWorkflowFilePath]).toMatchSnapshot()
  })
})

describe('CodeArtifactOptions', () => {
  describe('GitHub OIDC auth provider', () => {
    const project = new DeployableAwsCdkTypeScriptApp({
      packageManager: NodePackageManager.NPM,
      name: 'my-test-app',
      defaultReleaseBranch: 'main',
      cdkVersion: '1.129.0',
      scopedPackagesOptions: [
        {
          registryUrl: 'https://my-domain-111122223333.d.codeartifact.us-west-2.amazonaws.com/npm/my_repo/',
          scope: '@blah',
        },
      ],
      codeArtifactOptions: {
        roleToAssume: 'stub-role-1',
        authProvider: CodeArtifactAuthProvider.GITHUB_OIDC,
      },
      deployOptions: {
        environments: [
          {
            name: 'dev1',
            awsCredentials: {
              roleToAssume: 'stub-role-2',
              region: 'dev-aws-region-1',
            },
          },
        ],
      },
    })
    const synthOutput = synthSnapshot(project)

    test('release workflow should not contain aws secrets', () => {
      expect(synthOutput[releaseWorkflowFilePath]).toMatchSnapshot()
    })
  })
})

describe('node version 18', () => {
  describe('environmentVariableName', () => {
    const project = new DeployableAwsCdkTypeScriptApp({
      packageManager: NodePackageManager.NPM,
      name: 'my-test-app',
      defaultReleaseBranch: 'main',
      workflowNodeVersion: '18',
      cdkVersion: '1.129.0',
      deployOptions: {
        environmentVariableName: 'STAGE',
        environments: [
          {
            name: 'dev1',
            awsCredentials: {
              roleToAssume: 'stub-role-2',
              region: 'dev-aws-region-1',
            },
          },
        ],
      },
    })
    const synthOutput = synthSnapshot(project)

    test('release workflow', () => {
      expect(synthOutput[releaseWorkflowFilePath]).toMatchSnapshot()
    })
  })

  describe('npmConfigEnvironment', () => {
    test('should throw when npmConfigEnvironment is set', () => {
      expect(() => new DeployableAwsCdkTypeScriptApp({
        packageManager: NodePackageManager.NPM,
        name: 'my-test-app',
        defaultReleaseBranch: 'main',
        workflowNodeVersion: '18',
        cdkVersion: '1.129.0',
        deployOptions: {
          npmConfigEnvironment: 'stack',
          environments: [
            {
              name: 'dev1',
              awsCredentials: {
                roleToAssume: 'stub-role-2',
                region: 'dev-aws-region-1',
              },
            },
          ],
        },
      })).toThrow()
    })
  })
})