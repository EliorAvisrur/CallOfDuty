export function isDutyFound(duty, id) {
  if (!duty)
    return { error: { status: 400, message: `Duty not found with id=${id}` } };
  return {};
}

export function validateDeleteOrPatchDutyById(duty, id, act) {
  if (!duty)
    return { error: { status: 400, message: `Duty not found with id=${id}` } };
  if (duty.status === 'scheduled')
    return {
      error: {
        status: 400,
        message: `Duty is scheduled , so you can't ${act} it`
      }
    };
  return {};
}

export function getUpdatedData(newDutyProperties) {
  const updateData = {
    $set: newDutyProperties
  };
  if (newDutyProperties.status && newDutyProperties.status != duty.status) {
    updateData.$push = {
      statusHistory: {
        status: newDutyProperties.status,
        date: new Date().toISOString()
      }
    };
  }
  return { updateData: updateData };
}

export function appendConstraintsWithTimestamp(data) {
  const updatedAtInfo = { updatedAt: new Date().toISOString() };
  const updatedData = {
    $set: updatedAtInfo,
    $push: {
      constraints: { $each: data }
    }
  };
  return updatedData;
}
