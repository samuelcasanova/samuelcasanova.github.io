import PremierCalendarReaderService from '../../Services/PremierCalendarReader/PremierCalendarReaderService'

class MatchService {
  async getMatches () {
    const premierCalendarReaderService = new PremierCalendarReaderService()
    return premierCalendarReaderService.getBenjaminMatches()
  }
}

export default MatchService
