export async function getJustice_Board(soldiers) {
  const justiceBoard = await soldiers
    .aggregate([
      {
        $lookup: {
          from: 'duties',
          let: { soldierId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $in: ['$$soldierId', '$soldiers'] }
              }
            },
            {
              $project: { value: 1 }
            }
          ],
          as: 'assignedDuties'
        }
      },
      {
        $addFields: {
          score: {
            $sum: '$assignedDuties.value'
          }
        }
      },
      {
        $project: { _id: 1, score: 1 }
      }
    ])
    .toArray();
  return justiceBoard;
}

export async function getSoldierTotalScore(duties, id) {
  const soldierTotalScore = await duties
    .aggregate([
      { $match: { soldiers: id } },
      { $group: { _id: null, totalScore: { $sum: '$value' } } }
    ])
    .toArray();
  return soldierTotalScore;
}
export function isSoldierFound(soldierArrayLength) {
  if (soldierArrayLength === 0)
    return {
      error: { status: 400, message: "soldier with this id isn't existed" }
    };
  return {};
}
