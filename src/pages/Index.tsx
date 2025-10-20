import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InstallButton from '@/components/InstallButton';

interface Player {
  id: string;
  name: string;
  position: string;
  goals: number;
  assists: number;
  matches: number;
}

interface Team {
  id: string;
  name: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
  players: Player[];
  logoUrl?: string;
}

interface Match {
  id: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  status: 'scheduled' | 'finished';
}

const initialTeams: Team[] = [
  {
    id: '1',
    name: 'ФК ТОРПЕДО',
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0,
    form: [],
    players: [],
  },
  {
    id: '2',
    name: 'ФУ НАГЛЕЦЫ ИЗ ВОРОНЕЖА',
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0,
    form: [],
    players: [],
  },
  {
    id: '3',
    name: 'ФК UNION',
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0,
    form: [],
    players: [],
  },
  {
    id: '4',
    name: 'ФК САБОТАЖ',
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0,
    form: [],
    players: [],
  },
  {
    id: '5',
    name: 'ФК ПРИДОН',
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0,
    form: [],
    players: [],
  },
  {
    id: '6',
    name: 'ФК МУХТАР',
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0,
    form: [],
    players: [],
  },
];

const initialMatches: Match[] = [];

const Index = () => {
  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem('footballTeams');
    return saved ? JSON.parse(saved) : initialTeams;
  });
  const [matches, setMatches] = useState<Match[]>(() => {
    const saved = localStorage.getItem('footballMatches');
    return saved ? JSON.parse(saved) : initialMatches;
  });
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [editingPlayer, setEditingPlayer] = useState<{teamId: string, player: Player} | null>(null);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [newTeamName, setNewTeamName] = useState('');
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerPosition, setNewPlayerPosition] = useState('');
  const [newMatchHomeTeam, setNewMatchHomeTeam] = useState('');
  const [newMatchAwayTeam, setNewMatchAwayTeam] = useState('');
  const [newMatchDate, setNewMatchDate] = useState('');
  const [isAddingMatch, setIsAddingMatch] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [editingLogo, setEditingLogo] = useState<{teamId: string, currentUrl?: string} | null>(null);
  const [newLogoUrl, setNewLogoUrl] = useState('');

  const adminPassword = 'admin123';
  const API_URL = 'https://functions.poehali.dev/e72c0a94-78e5-4cc8-8bf5-30193a2cec40';

  const fetchData = async () => {
    try {
      setIsSyncing(true);
      const [teamsRes, matchesRes] = await Promise.all([
        fetch(`${API_URL}?path=teams`),
        fetch(`${API_URL}?path=matches`)
      ]);
      
      if (teamsRes.ok && matchesRes.ok) {
        const teamsData = await teamsRes.json();
        const matchesData = await matchesRes.json();
        
        if (teamsData.teams) {
          const formattedTeams = teamsData.teams.map((t: any) => ({
            id: t.id,
            name: t.name,
            played: t.played || 0,
            won: t.won || 0,
            drawn: t.drawn || 0,
            lost: t.lost || 0,
            goalsFor: t.goals_for || 0,
            goalsAgainst: t.goals_against || 0,
            points: t.points || 0,
            form: t.form ? JSON.parse(t.form) : [],
            players: t.players || [],
            logoUrl: t.logo_url
          }));
          setTeams(formattedTeams);
        }
        
        if (matchesData.matches) {
          const formattedMatches = matchesData.matches.map((m: any) => ({
            id: m.id,
            date: m.date,
            homeTeam: m.home_team,
            awayTeam: m.away_team,
            homeScore: m.home_score,
            awayScore: m.away_score,
            status: m.status
          }));
          setMatches(formattedMatches);
        }
        
        setLastSyncTime(new Date());
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 1500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('footballTeams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('footballMatches', JSON.stringify(matches));
  }, [matches]);

  const handleAdminLogin = () => {
    if (password === adminPassword) {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setPassword('');
    } else {
      alert('Неверный пароль!');
    }
  };

  const updateTeamName = async (teamId: string, newName: string) => {
    const oldName = teams.find(t => t.id === teamId)?.name;
    setTeams(teams.map(t => t.id === teamId ? {...t, name: newName} : t));
    setMatches(matches.map(m => ({
      ...m,
      homeTeam: m.homeTeam === oldName ? newName : m.homeTeam,
      awayTeam: m.awayTeam === oldName ? newName : m.awayTeam
    })));
    setEditingTeam(null);
    
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({action: 'update_team', team_id: teamId, updates: {name: newName}})
      });
      await fetchData();
    } catch (error) {
      console.error('Ошибка обновления названия команды:', error);
    }
  };

  const updateTeamLogo = async (teamId: string, logoUrl: string) => {
    setTeams(teams.map(t => t.id === teamId ? {...t, logoUrl} : t));
    setEditingLogo(null);
    setNewLogoUrl('');
    
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({action: 'update_team', team_id: teamId, updates: {logo_url: logoUrl}})
      });
      await fetchData();
    } catch (error) {
      console.error('Ошибка обновления логотипа:', error);
    }
  };

  const updateTeamStats = async (teamId: string, updates: Partial<Team>) => {
    setTeams(teams.map(t => t.id === teamId ? {...t, ...updates} : t));
    setEditingTeam(null);
    
    const dbUpdates: any = {};
    if (updates.goalsFor !== undefined) dbUpdates.goals_for = updates.goalsFor;
    if (updates.goalsAgainst !== undefined) dbUpdates.goals_against = updates.goalsAgainst;
    if (updates.played !== undefined) dbUpdates.played = updates.played;
    if (updates.won !== undefined) dbUpdates.won = updates.won;
    if (updates.drawn !== undefined) dbUpdates.drawn = updates.drawn;
    if (updates.lost !== undefined) dbUpdates.lost = updates.lost;
    if (updates.points !== undefined) dbUpdates.points = updates.points;
    if (updates.form !== undefined) dbUpdates.form = JSON.stringify(updates.form);
    
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({action: 'update_team', team_id: teamId, updates: dbUpdates})
      });
      await fetchData();
    } catch (error) {
      console.error('Ошибка обновления команды:', error);
    }
  };

  const updatePlayer = async (teamId: string, playerId: string, updates: Partial<Player>) => {
    setTeams(teams.map(t => 
      t.id === teamId 
        ? {...t, players: t.players.map(p => p.id === playerId ? {...p, ...updates} : p)}
        : t
    ));
    setEditingPlayer(null);
    
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({action: 'update_player', player_id: playerId, updates})
      });
      await fetchData();
    } catch (error) {
      console.error('Ошибка обновления игрока:', error);
    }
  };

  const addPlayer = async (teamId: string) => {
    if (!newPlayerName || !newPlayerPosition) return;
    const newPlayer: Player = {
      id: Date.now().toString(),
      name: newPlayerName,
      position: newPlayerPosition,
      goals: 0,
      assists: 0,
      matches: 0
    };
    setTeams(teams.map(t => 
      t.id === teamId ? {...t, players: [...t.players, newPlayer]} : t
    ));
    setNewPlayerName('');
    setNewPlayerPosition('');
    
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({action: 'add_player', player: {...newPlayer, team_id: teamId}})
      });
      await fetchData();
    } catch (error) {
      console.error('Ошибка добавления игрока:', error);
    }
  };

  const updateMatchScore = async (matchId: string, homeScore: number, awayScore: number) => {
    setMatches(matches.map(m => 
      m.id === matchId ? {...m, homeScore, awayScore, status: 'finished' as const} : m
    ));
    setEditingMatch(null);
    
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          action: 'update_match',
          match_id: matchId,
          updates: {homeScore, awayScore, status: 'finished'}
        })
      });
      await fetchData();
    } catch (error) {
      console.error('Ошибка обновления матча:', error);
    }
  };

  const addMatch = async () => {
    if (!newMatchHomeTeam || !newMatchAwayTeam || !newMatchDate) return;
    const newMatch: Match = {
      id: Date.now().toString(),
      date: newMatchDate,
      homeTeam: newMatchHomeTeam,
      awayTeam: newMatchAwayTeam,
      homeScore: null,
      awayScore: null,
      status: 'scheduled'
    };
    setMatches([...matches, newMatch]);
    setNewMatchHomeTeam('');
    setNewMatchAwayTeam('');
    setNewMatchDate('');
    setIsAddingMatch(false);
    
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({action: 'add_match', match: newMatch})
      });
      await fetchData();
    } catch (error) {
      console.error('Ошибка добавления матча:', error);
    }
  };

  const sortedTeams = [...teams].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const diffA = a.goalsFor - a.goalsAgainst;
    const diffB = b.goalsFor - b.goalsAgainst;
    return diffB - diffA;
  });

  const upcomingMatches = matches.filter((m) => m.status === 'scheduled');
  const pastMatches = matches.filter((m) => m.status === 'finished');

  const getFormBadgeColor = (result: 'W' | 'D' | 'L') => {
    if (result === 'W') return 'bg-green-500 hover:bg-green-500 text-white';
    if (result === 'D') return 'bg-yellow-500 hover:bg-yellow-500 text-white';
    return 'bg-red-500 hover:bg-red-500 text-white';
  };

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 z-0">
        <img 
          src="https://cdn.poehali.dev/projects/5af3188e-620b-4638-a258-d8bd1c941cff/files/3132a97b-5365-496f-a4e2-0939f59e1cd1.jpg" 
          alt="Stadium background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background backdrop-blur-sm"></div>
        <div className="absolute inset-0 football-pattern"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-accent/5"></div>
      </div>
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            {isSyncing ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="animate-spin">
                  <Icon name="RefreshCw" size={16} />
                </div>
                <span>Синхронизация...</span>
              </div>
            ) : lastSyncTime ? (
              <div className="flex items-center gap-2 text-sm text-green-500">
                <Icon name="CheckCircle2" size={16} />
                <span>Синхронизировано {lastSyncTime.toLocaleTimeString('ru-RU')}</span>
              </div>
            ) : null}
            <InstallButton />
          </div>
          <div>
          {!isAdmin ? (
            <Dialog open={showAdminLogin} onOpenChange={setShowAdminLogin}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Icon name="Lock" size={16} className="mr-2" />
                  Режим редактирования
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Вход в режим редактирования</DialogTitle>
                  <DialogDescription>
                    Введите пароль для доступа к редактированию
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Пароль</Label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                      placeholder="Введите пароль"
                    />
                  </div>
                  <Button onClick={handleAdminLogin} className="w-full">
                    Войти
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAdmin(false)}
            >
              <Icon name="LogOut" size={16} className="mr-2" />
              Выйти из редактирования
            </Button>
          )}
          </div>
        </div>
        <div className="mb-8 relative overflow-hidden rounded-2xl animate-slide-up shadow-2xl">
          <div className="relative h-64 bg-gradient-to-br from-primary via-accent to-primary shadow-inner">
            <img 
              src="https://cdn.poehali.dev/projects/5af3188e-620b-4638-a258-d8bd1c941cff/files/ec79f03a-2fc9-48b4-8e52-a3fe4e639037.jpg" 
              alt="ЛДЛ League Banner"
              className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
              <div className="flex items-center gap-6 mb-4 animate-scale-in">
                <div className="relative">
                  <Icon name="Trophy" size={70} className="text-accent drop-shadow-2xl animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-ping"></div>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-8xl font-black text-white tracking-widest drop-shadow-2xl" style={{textShadow: '0 0 30px rgba(234, 179, 8, 0.5), 4px 4px 8px rgba(0,0,0,0.8)'}}>
                    ЛДЛ
                  </h1>
                  <div className="text-5xl font-black text-accent tracking-wider drop-shadow-xl mt-1">
                    ВОРОНЕЖ
                  </div>
                </div>
                <div className="relative">
                  <Icon name="Award" size={70} className="text-accent drop-shadow-2xl animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-ping"></div>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-1 w-16 bg-accent rounded-full"></div>
                <p className="text-white/95 text-3xl font-bold tracking-wide drop-shadow-lg">Любительская Дворовая Лига</p>
                <div className="h-1 w-16 bg-accent rounded-full"></div>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <div className="px-4 py-1 bg-accent/20 backdrop-blur-sm border-2 border-accent rounded-full">
                  <p className="text-accent text-xl font-black drop-shadow-md">⚽ СЕЗОН 2025/2026 ⚽</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="standings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
            <TabsTrigger value="standings" className="text-base font-bold">
              <Icon name="Table2" size={18} className="mr-2" />
              Турнирная таблица
            </TabsTrigger>
            <TabsTrigger value="players" className="text-base font-bold">
              <Icon name="Users" size={18} className="mr-2" />
              Игроки
            </TabsTrigger>
            <TabsTrigger value="calendar" className="text-base font-bold">
              <Icon name="Calendar" size={18} className="mr-2" />
              Календарь
            </TabsTrigger>
          </TabsList>

          <TabsContent value="standings" className="animate-slide-up">
            <Card className="border-2 border-primary/20 shadow-xl shadow-primary/10 backdrop-blur-sm bg-card/95">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-primary/20">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Icon name="Trophy" size={28} className="text-accent animate-pulse" />
                  Турнирная таблица
                  <Icon name="Medal" size={24} className="text-primary ml-auto" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12 text-center text-xs">#</TableHead>
                      <TableHead className="text-xs">Команда</TableHead>
                      <TableHead className="text-center text-xs">И</TableHead>
                      <TableHead className="text-center text-xs">В</TableHead>
                      <TableHead className="text-center text-xs">Н</TableHead>
                      <TableHead className="text-center text-xs">П</TableHead>
                      <TableHead className="text-center text-xs">МЗ</TableHead>
                      <TableHead className="text-center text-xs">МП</TableHead>
                      <TableHead className="text-center text-xs">РМ</TableHead>
                      <TableHead className="text-center font-bold text-xs">О</TableHead>
                      <TableHead className="text-center text-xs">Форма</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedTeams.map((team, index) => (
                      <TableRow
                        key={team.id}
                        className="hover:bg-primary/10 transition-all duration-300 border-b border-primary/5 hover:scale-[1.01]"
                      >
                        <TableCell className="text-center font-bold text-sm">
                          <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                            index === 0 ? 'bg-accent text-background' :
                            index === 1 ? 'bg-primary/80 text-white' :
                            index === 2 ? 'bg-secondary/80 text-white' :
                            'bg-muted text-muted-foreground'
                          } font-bold`}>
                            {index + 1}
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-xs">
                          <div className="flex items-center gap-3">
                            {team.logoUrl ? (
                              <img 
                                src={team.logoUrl} 
                                alt={team.name}
                                className="w-10 h-10 rounded-full object-cover border-2 border-primary/20"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                <Icon name="Shield" size={20} className="text-white" />
                              </div>
                            )}
                            <Dialog>
                              <DialogTrigger asChild>
                                <button 
                                  className="text-left hover:text-primary hover:underline transition-colors cursor-pointer"
                                  onClick={() => setSelectedTeam(team)}
                                >
                                  {team.name}
                                </button>
                              </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <Icon name="Users" size={24} className="text-primary" />
                                  {team.name} - Состав команды
                                </DialogTitle>
                              </DialogHeader>
                              <div className="py-4">
                                {team.players.length === 0 ? (
                                  <p className="text-center text-muted-foreground py-8">
                                    Игроки еще не добавлены
                                  </p>
                                ) : (
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Имя</TableHead>
                                        <TableHead>Позиция</TableHead>
                                        <TableHead className="text-center">Голы</TableHead>
                                        <TableHead className="text-center">Пасы</TableHead>
                                        <TableHead className="text-center">Матчи</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {team.players.map((player) => (
                                        <TableRow key={player.id}>
                                          <TableCell className="font-medium">{player.name}</TableCell>
                                          <TableCell>{player.position}</TableCell>
                                          <TableCell className="text-center font-semibold text-green-600">
                                            {player.goals}
                                          </TableCell>
                                          <TableCell className="text-center font-semibold text-blue-600">
                                            {player.assists}
                                          </TableCell>
                                          <TableCell className="text-center">{player.matches}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                          </div>
                        </TableCell>
                        <TableCell className="text-center text-xs">{team.played}</TableCell>
                        <TableCell className="text-center text-green-600 font-semibold text-xs">
                          {team.won}
                        </TableCell>
                        <TableCell className="text-center text-yellow-600 font-semibold text-xs">
                          {team.drawn}
                        </TableCell>
                        <TableCell className="text-center text-red-600 font-semibold text-xs">
                          {team.lost}
                        </TableCell>
                        <TableCell className="text-center text-xs">{team.goalsFor}</TableCell>
                        <TableCell className="text-center text-xs">{team.goalsAgainst}</TableCell>
                        <TableCell className="text-center font-semibold text-xs">
                          {team.goalsFor - team.goalsAgainst > 0 ? '+' : ''}
                          {team.goalsFor - team.goalsAgainst}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center justify-center bg-gradient-to-br from-primary to-accent text-white font-black text-lg px-3 py-1 rounded-lg shadow-md">
                            {team.points}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {team.form.map((result, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className={`w-6 h-6 flex items-center justify-center text-xs font-bold ${getFormBadgeColor(
                                  result
                                )}`}
                              >
                                {result}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {isAdmin && (
                            <>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditingLogo({teamId: team.id, currentUrl: team.logoUrl});
                                    setNewLogoUrl(team.logoUrl || '');
                                  }}
                                >
                                  <Icon name="Image" size={16} />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    <Icon name="Image" size={24} className="text-primary" />
                                    Логотип команды {team.name}
                                  </DialogTitle>
                                  <DialogDescription>
                                    Добавьте URL изображения для логотипа команды
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  {newLogoUrl && (
                                    <div className="flex justify-center">
                                      <img 
                                        src={newLogoUrl} 
                                        alt="Предпросмотр"
                                        className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
                                        onError={(e) => {
                                          e.currentTarget.src = '';
                                          e.currentTarget.style.display = 'none';
                                        }}
                                      />
                                    </div>
                                  )}
                                  <div className="space-y-2">
                                    <Label>URL логотипа</Label>
                                    <Input
                                      placeholder="https://example.com/logo.png"
                                      value={newLogoUrl}
                                      onChange={(e) => setNewLogoUrl(e.target.value)}
                                    />
                                  </div>
                                  <Button
                                    onClick={() => updateTeamLogo(team.id, newLogoUrl)}
                                    className="w-full"
                                  >
                                    <Icon name="Save" size={16} className="mr-2" />
                                    Сохранить логотип
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedTeam(team)}
                                >
                                  <Icon name="Info" size={16} />
                                </Button>
                              </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <Icon name="Shield" size={24} className="text-primary" />
                                  {team.name}
                                </DialogTitle>
                                <DialogDescription>
                                  Статистика команды
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid grid-cols-2 gap-4 py-4">
                                <div className="space-y-2">
                                  <p className="text-sm text-muted-foreground">Очки</p>
                                  <p className="text-2xl font-black text-primary">
                                    {team.points}
                                  </p>
                                </div>
                                <div className="space-y-2">
                                  <p className="text-sm text-muted-foreground">
                                    Разница мячей
                                  </p>
                                  <p className="text-2xl font-bold">
                                    {team.goalsFor - team.goalsAgainst > 0 ? '+' : ''}
                                    {team.goalsFor - team.goalsAgainst}
                                  </p>
                                </div>
                                <div className="space-y-2">
                                  <p className="text-sm text-muted-foreground">Побед</p>
                                  <p className="text-2xl font-bold text-green-600">
                                    {team.won}
                                  </p>
                                </div>
                                <div className="space-y-2">
                                  <p className="text-sm text-muted-foreground">Поражений</p>
                                  <p className="text-2xl font-bold text-red-600">
                                    {team.lost}
                                  </p>
                                </div>
                              </div>
                            </DialogContent>
                            </Dialog>
                            <Dialog open={editingTeam?.id === team.id} onOpenChange={(open) => !open && setEditingTeam(null)}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditingTeam(team);
                                    setNewTeamName(team.name);
                                  }}
                                >
                                  <Icon name="Pencil" size={16} />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Редактировать команду</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label>Название команды</Label>
                                    <Input
                                      defaultValue={team.name}
                                      id={`team-name-${team.id}`}
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label>Очки</Label>
                                      <Input
                                        type="number"
                                        defaultValue={team.points}
                                        id={`team-points-${team.id}`}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Игры</Label>
                                      <Input
                                        type="number"
                                        defaultValue={team.played}
                                        id={`team-played-${team.id}`}
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                      <Label>Победы</Label>
                                      <Input
                                        type="number"
                                        defaultValue={team.won}
                                        id={`team-won-${team.id}`}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Ничьи</Label>
                                      <Input
                                        type="number"
                                        defaultValue={team.drawn}
                                        id={`team-drawn-${team.id}`}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Поражения</Label>
                                      <Input
                                        type="number"
                                        defaultValue={team.lost}
                                        id={`team-lost-${team.id}`}
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label>Мячи забито</Label>
                                      <Input
                                        type="number"
                                        defaultValue={team.goalsFor}
                                        id={`team-goalsfor-${team.id}`}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Мячи пропущено</Label>
                                      <Input
                                        type="number"
                                        defaultValue={team.goalsAgainst}
                                        id={`team-goalsagainst-${team.id}`}
                                      />
                                    </div>
                                  </div>
                                  <Button
                                    onClick={() => {
                                      const name = (document.getElementById(`team-name-${team.id}`) as HTMLInputElement).value;
                                      const points = parseInt((document.getElementById(`team-points-${team.id}`) as HTMLInputElement).value) || 0;
                                      const played = parseInt((document.getElementById(`team-played-${team.id}`) as HTMLInputElement).value) || 0;
                                      const won = parseInt((document.getElementById(`team-won-${team.id}`) as HTMLInputElement).value) || 0;
                                      const drawn = parseInt((document.getElementById(`team-drawn-${team.id}`) as HTMLInputElement).value) || 0;
                                      const lost = parseInt((document.getElementById(`team-lost-${team.id}`) as HTMLInputElement).value) || 0;
                                      const goalsFor = parseInt((document.getElementById(`team-goalsfor-${team.id}`) as HTMLInputElement).value) || 0;
                                      const goalsAgainst = parseInt((document.getElementById(`team-goalsagainst-${team.id}`) as HTMLInputElement).value) || 0;
                                      
                                      const oldName = teams.find(t => t.id === team.id)?.name;
                                      setTeams(teams.map(t => t.id === team.id ? {...t, name, points, played, won, drawn, lost, goalsFor, goalsAgainst} : t));
                                      if (oldName !== name) {
                                        setMatches(matches.map(m => ({
                                          ...m,
                                          homeTeam: m.homeTeam === oldName ? name : m.homeTeam,
                                          awayTeam: m.awayTeam === oldName ? name : m.awayTeam
                                        })));
                                      }
                                      setEditingTeam(null);
                                    }}
                                    className="w-full"
                                  >
                                    Сохранить изменения
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="players" className="animate-fade-in">
            <div className="grid gap-6">
              {sortedTeams.map((team) => (
                <Card key={team.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="Shield" size={24} className="text-primary" />
                      {team.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Игрок</TableHead>
                          <TableHead>Позиция</TableHead>
                          <TableHead className="text-center">Матчи</TableHead>
                          <TableHead className="text-center">Голы</TableHead>
                          <TableHead className="text-center">Передачи</TableHead>
                          <TableHead className="text-center">Г+П</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {team.players.map((player) => (
                          <TableRow key={player.id}>
                            <TableCell className="font-bold">{player.name}</TableCell>
                            <TableCell className="text-muted-foreground">
                              {player.position}
                            </TableCell>
                            <TableCell className="text-center">
                              {player.matches}
                            </TableCell>
                            <TableCell className="text-center font-bold text-green-600">
                              {player.goals}
                            </TableCell>
                            <TableCell className="text-center font-bold text-blue-600">
                              {player.assists}
                            </TableCell>
                            <TableCell className="text-center font-black text-primary">
                              {player.goals + player.assists}
                            </TableCell>
                            {isAdmin && (
                            <TableCell>
                              <Dialog open={editingPlayer?.player.id === player.id} onOpenChange={(open) => !open && setEditingPlayer(null)}>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setEditingPlayer({teamId: team.id, player})}
                                  >
                                    <Icon name="Pencil" size={16} />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Редактировать игрока</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <Label>Имя игрока</Label>
                                      <Input
                                        defaultValue={player.name}
                                        onChange={(e) => {
                                          if (editingPlayer) {
                                            setEditingPlayer({
                                              ...editingPlayer,
                                              player: {...editingPlayer.player, name: e.target.value}
                                            });
                                          }
                                        }}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Позиция</Label>
                                      <Input
                                        defaultValue={player.position}
                                        onChange={(e) => {
                                          if (editingPlayer) {
                                            setEditingPlayer({
                                              ...editingPlayer,
                                              player: {...editingPlayer.player, position: e.target.value}
                                            });
                                          }
                                        }}
                                      />
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                      <div className="space-y-2">
                                        <Label>Голы</Label>
                                        <Input
                                          type="number"
                                          defaultValue={player.goals}
                                          onChange={(e) => {
                                            if (editingPlayer) {
                                              setEditingPlayer({
                                                ...editingPlayer,
                                                player: {...editingPlayer.player, goals: parseInt(e.target.value) || 0}
                                              });
                                            }
                                          }}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label>Передачи</Label>
                                        <Input
                                          type="number"
                                          defaultValue={player.assists}
                                          onChange={(e) => {
                                            if (editingPlayer) {
                                              setEditingPlayer({
                                                ...editingPlayer,
                                                player: {...editingPlayer.player, assists: parseInt(e.target.value) || 0}
                                              });
                                            }
                                          }}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label>Матчи</Label>
                                        <Input
                                          type="number"
                                          defaultValue={player.matches}
                                          onChange={(e) => {
                                            if (editingPlayer) {
                                              setEditingPlayer({
                                                ...editingPlayer,
                                                player: {...editingPlayer.player, matches: parseInt(e.target.value) || 0}
                                              });
                                            }
                                          }}
                                        />
                                      </div>
                                    </div>
                                    <Button
                                      onClick={() => {
                                        if (editingPlayer) {
                                          updatePlayer(editingPlayer.teamId, player.id, editingPlayer.player);
                                        }
                                      }}
                                      className="w-full"
                                    >
                                      Сохранить
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {isAdmin && (
                    <div className="mt-4 pt-4 border-t">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full">
                            <Icon name="UserPlus" size={16} className="mr-2" />
                            Добавить игрока
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Добавить игрока в {team.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Имя игрока</Label>
                              <Input
                                value={newPlayerName}
                                onChange={(e) => setNewPlayerName(e.target.value)}
                                placeholder="Введите имя"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Позиция</Label>
                              <Input
                                value={newPlayerPosition}
                                onChange={(e) => setNewPlayerPosition(e.target.value)}
                                placeholder="Нападающий, Вратарь, и т.д."
                              />
                            </div>
                            <Button
                              onClick={() => addPlayer(team.id)}
                              className="w-full"
                            >
                              Добавить
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="animate-fade-in space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Icon name="CalendarClock" size={24} className="text-accent" />
                  Предстоящие матчи
                </CardTitle>
                {isAdmin && (
                <Dialog open={isAddingMatch} onOpenChange={setIsAddingMatch}>
                  <DialogTrigger asChild>
                    <Button variant="default">
                      <Icon name="Plus" size={16} className="mr-2" />
                      Добавить матч
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Создать новый матч</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Дата матча</Label>
                        <Input
                          type="date"
                          value={newMatchDate}
                          onChange={(e) => setNewMatchDate(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Команда хозяев</Label>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          value={newMatchHomeTeam}
                          onChange={(e) => setNewMatchHomeTeam(e.target.value)}
                        >
                          <option value="">Выберите команду</option>
                          {teams.map((team) => (
                            <option key={team.id} value={team.name}>
                              {team.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Команда гостей</Label>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          value={newMatchAwayTeam}
                          onChange={(e) => setNewMatchAwayTeam(e.target.value)}
                        >
                          <option value="">Выберите команду</option>
                          {teams.map((team) => (
                            <option key={team.id} value={team.name}>
                              {team.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <Button
                        onClick={addMatch}
                        className="w-full"
                        disabled={!newMatchHomeTeam || !newMatchAwayTeam || !newMatchDate}
                      >
                        Создать матч
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                )}
              </CardHeader>
              <CardContent>
                {upcomingMatches.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Icon name="CalendarX" size={48} className="mx-auto mb-3 opacity-50" />
                    <p>Нет предстоящих матчей</p>
                    <p className="text-sm mt-1">Нажмите "Добавить матч" чтобы создать расписание</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                  {upcomingMatches.map((match) => (
                    <div
                      key={match.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-primary/5 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="text-sm text-muted-foreground min-w-24">
                          {new Date(match.date).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'long',
                          })}
                        </div>
                        <div className="flex items-center gap-3 flex-1 justify-between">
                          <div className="flex items-center gap-2 flex-1 justify-end">
                            <div className="font-bold text-right">
                              {match.homeTeam}
                            </div>
                            {teams.find(t => t.name === match.homeTeam)?.logoUrl && (
                              <img 
                                src={teams.find(t => t.name === match.homeTeam)?.logoUrl} 
                                alt={match.homeTeam}
                                className="w-8 h-8 rounded-full object-cover border-2 border-primary/20"
                              />
                            )}
                          </div>
                          <Badge variant="outline" className="px-3 mx-2">
                            VS
                          </Badge>
                          <div className="flex items-center gap-2 flex-1">
                            {teams.find(t => t.name === match.awayTeam)?.logoUrl && (
                              <img 
                                src={teams.find(t => t.name === match.awayTeam)?.logoUrl} 
                                alt={match.awayTeam}
                                className="w-8 h-8 rounded-full object-cover border-2 border-primary/20"
                              />
                            )}
                            <div className="font-bold text-left">
                              {match.awayTeam}
                            </div>
                          </div>
                        </div>
                      </div>
                      {isAdmin && (
                      <Dialog open={editingMatch?.id === match.id} onOpenChange={(open) => !open && setEditingMatch(null)}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingMatch(match)}
                          >
                            <Icon name="Edit" size={16} className="mr-2" />
                            Внести результат
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Результат матча</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="flex items-center gap-4">
                              <div className="flex-1 space-y-2">
                                <Label>{match.homeTeam}</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  defaultValue={match.homeScore || 0}
                                  id={`home-${match.id}`}
                                />
                              </div>
                              <div className="text-2xl font-bold">:</div>
                              <div className="flex-1 space-y-2">
                                <Label>{match.awayTeam}</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  defaultValue={match.awayScore || 0}
                                  id={`away-${match.id}`}
                                />
                              </div>
                            </div>
                            <Button
                              onClick={() => {
                                const homeInput = document.getElementById(`home-${match.id}`) as HTMLInputElement;
                                const awayInput = document.getElementById(`away-${match.id}`) as HTMLInputElement;
                                updateMatchScore(match.id, parseInt(homeInput.value) || 0, parseInt(awayInput.value) || 0);
                              }}
                              className="w-full"
                            >
                              Сохранить результат
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      )}
                    </div>
                  ))}
                </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="History" size={24} className="text-primary" />
                  Результаты матчей
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pastMatches.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Icon name="FileX" size={48} className="mx-auto mb-3 opacity-50" />
                    <p>Нет завершённых матчей</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                  {pastMatches.map((match) => (
                    <div
                      key={match.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="text-sm text-muted-foreground min-w-24">
                          {new Date(match.date).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'long',
                          })}
                        </div>
                        <div className="flex items-center gap-3 flex-1 justify-between">
                          <div className="flex items-center gap-2 flex-1 justify-end">
                            <div className="font-bold text-right">
                              {match.homeTeam}
                            </div>
                            {teams.find(t => t.name === match.homeTeam)?.logoUrl && (
                              <img 
                                src={teams.find(t => t.name === match.homeTeam)?.logoUrl} 
                                alt={match.homeTeam}
                                className="w-8 h-8 rounded-full object-cover border-2 border-primary/20"
                              />
                            )}
                          </div>
                          <Badge
                            variant="secondary"
                            className="px-4 py-1 text-base font-black mx-2"
                          >
                            {match.homeScore} : {match.awayScore}
                          </Badge>
                          <div className="flex items-center gap-2 flex-1">
                            {teams.find(t => t.name === match.awayTeam)?.logoUrl && (
                              <img 
                                src={teams.find(t => t.name === match.awayTeam)?.logoUrl} 
                                alt={match.awayTeam}
                                className="w-8 h-8 rounded-full object-cover border-2 border-primary/20"
                              />
                            )}
                            <div className="font-bold text-left">
                              {match.awayTeam}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;