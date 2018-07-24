const Questions = [{
    type: 'select',
    name: 'drink',
    message: 'What do you want to drink?',
    choices: [
        { title: 'Moscow Mule', value: 'MoscowMule' },
        { title: 'Munich Mule', value: 'MunichMule' },
        { title: 'Vodka Shot', value: 'VodkaShot' },
        { title: 'Gin Shot', value: 'GinShot' },
    ],
    initial: 0
},
{
    type: 'number',
    name: 'amount',
    message: 'How many drinks do you want?',
    initial: 1,
    style: 'default',
    min: 1,
    max: 5
  }
];

exports.Questions = Questions;