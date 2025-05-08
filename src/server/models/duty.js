function createDuty(dutyProperties) {
  const {
    name,
    description,
    location,
    startTime,
    endTime,
    minRank,
    maxRank,
    constraints,
    soldiersRequired,
    value
  } = dutyProperties;
  const newDuty = {
    name: name,
    description: description,
    location: location,
    startTime: startTime,
    endTime: endTime,
    constraints: constraints,
    soldiersRequired: soldiersRequired,
    value: value,
    soldiers: [],
    status: 'unscheduled',
    statusHistory: [{ status: 'unscheduled', date: new Date().toISOString() }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  if (minRank) {
    newDuty.minRank = minRank;
  }
  if (maxRank) {
    newDuty.maxRank = maxRank;
  }
  return newDuty;
}

function adjustDutyToFilter(query) {
  const numberOptions = ['minRank', 'maxRank', 'soldiersRequired', 'value'];
  const jsonOptions = ['location', 'constraints', 'soldiers'];
  const filter = Object.entries(query).reduce((acc, [key, value]) => {
    if (numberOptions.includes(key)) {
      value = Number.parseInt(value);
    } else if (jsonOptions.includes(key)) {
      value = JSON.parse(value);
    }
    if (value != null) {
      acc[key] = value;
    }
    return acc;
  }, {});

  return filter;
}

export { createDuty, adjustDutyToFilter };
