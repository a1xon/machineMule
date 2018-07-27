const Questions = [{
    type: 'select',
    name: 'drink',
    message: 'What do you want to drink?',
    choices: [
        { title: 'Moscow Mule', value: 'MoscowMule' },
        { title: 'Vodka Shot', value: 'VodkaShot' },
        { title: '1 € paid', value: 1},
        { title: '2 € paid', value: 2},
        { title: '5 € paid', value: 5},
        { title: '10 € paid', value: 10},
        { title: 'FREE DRINKS', value: 0}
    ],
    initial: 0
},
{
    type: 'number',
    name: 'amount',
    message: 'How many drinks do you want?',
    initial: 1,
    style: 'default',
    min: 0,
    max: 10
  }
];

exports.Questions = Questions;