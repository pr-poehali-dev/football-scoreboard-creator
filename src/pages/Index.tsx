import { useState } from 'react';
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
    name: 'ФК ТОРНАДО',
    played: 10,
    won: 7,
    drawn: 2,
    lost: 1,
    goalsFor: 21,
    goalsAgainst: 8,
    points: 23,
    form: ['W', 'W', 'D', 'W', 'W'],
    players: [
      { id: '1', name: 'Промес', position: 'Нападающий', goals: 8, assists: 3, matches: 10 },
      { id: '2', name: 'Сафонов', position: 'Вратарь', goals: 0, assists: 0, matches: 10 },
      { id: '3', name: 'Зобнин', position: 'Полузащитник', goals: 2, assists: 5, matches: 10 },
    ],
  },
  {
    id: '2',
    name: 'ФК МОЛНИЯ',
    played: 10,
    won: 6,
    drawn: 3,
    lost: 1,
    goalsFor: 18,
    goalsAgainst: 7,
    points: 21,
    form: ['W', 'D', 'W', 'W', 'D'],
    players: [
      { id: '4', name: 'Дзюба', position: 'Нападающий', goals: 7, assists: 2, matches: 10 },
      { id: '5', name: 'Кержаков', position: 'Нападающий', goals: 5, assists: 4, matches: 9 },
    ],
  },
  {
    id: '3',
    name: 'ФК ТИТАН',
    played: 10,
    won: 6,
    drawn: 2,
    lost: 2,
    goalsFor: 17,
    goalsAgainst: 10,
    points: 20,
    form: ['L', 'W', 'W', 'D', 'W'],
    players: [
      { id: '6', name: 'Влашич', position: 'Полузащитник', goals: 6, assists: 3, matches: 10 },
    ],
  },
  {
    id: '4',
    name: 'ФК ВИКТОРИЯ',
    played: 10,
    won: 5,
    drawn: 3,
    lost: 2,
    goalsFor: 15,
    goalsAgainst: 11,
    points: 18,
    form: ['W', 'D', 'L', 'W', 'D'],
    players: [
      { id: '7', name: 'Смолов', position: 'Нападающий', goals: 5, assists: 1, matches: 10 },
    ],
  },
  {
    id: '5',
    name: 'ФК АТЛАНТ',
    played: 10,
    won: 4,
    drawn: 4,
    lost: 2,
    goalsFor: 14,
    goalsAgainst: 12,
    points: 16,
    form: ['D', 'W', 'D', 'L', 'W'],
    players: [
      { id: '8', name: 'Сулейманов', position: 'Полузащитник', goals: 4, assists: 2, matches: 10 },
    ],
  },
  {
    id: '6',
    name: 'ФК ФЕНИКС',
    played: 10,
    won: 3,
    drawn: 3,
    lost: 4,
    goalsFor: 11,
    goalsAgainst: 14,
    points: 12,
    form: ['L', 'D', 'W', 'L', 'D'],
    players: [
      { id: '9', name: 'Фомин', position: 'Полузащитник', goals: 3, assists: 4, matches: 10 },
    ],
  },
];

const initialMatches: Match[] = [
  {
    id: '1',
    date: '2025-10-25',
    homeTeam: 'ФК ТОРНАДО',
    awayTeam: 'ФК МОЛНИЯ',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
  },
  {
    id: '2',
    date: '2025-10-26',
    homeTeam: 'ФК ТИТАН',
    awayTeam: 'ФК ВИКТОРИЯ',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
  },
  {
    id: '3',
    date: '2025-10-27',
    homeTeam: 'ФК АТЛАНТ',
    awayTeam: 'ФК ФЕНИКС',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
  },
  {
    id: '4',
    date: '2025-10-20',
    homeTeam: 'ФК ТОРНАДО',
    awayTeam: 'ФК ТИТАН',
    homeScore: 2,
    awayScore: 1,
    status: 'finished',
  },
  {
    id: '5',
    date: '2025-10-21',
    homeTeam: 'ФК МОЛНИЯ',
    awayTeam: 'ФК ВИКТОРИЯ',
    homeScore: 1,
    awayScore: 1,
    status: 'finished',
  },
];

const Index = () => {
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [editingPlayer, setEditingPlayer] = useState<{teamId: string, player: Player} | null>(null);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [newTeamName, setNewTeamName] = useState('');
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerPosition, setNewPlayerPosition] = useState('');

  const updateTeamName = (teamId: string, newName: string) => {
    setTeams(teams.map(t => t.id === teamId ? {...t, name: newName} : t));
    setMatches(matches.map(m => ({
      ...m,
      homeTeam: m.homeTeam === teams.find(t => t.id === teamId)?.name ? newName : m.homeTeam,
      awayTeam: m.awayTeam === teams.find(t => t.id === teamId)?.name ? newName : m.awayTeam
    })));
    setEditingTeam(null);
  };

  const updateTeamStats = (teamId: string, updates: Partial<Team>) => {
    setTeams(teams.map(t => t.id === teamId ? {...t, ...updates} : t));
    setEditingTeam(null);
  };

  const updatePlayer = (teamId: string, playerId: string, updates: Partial<Player>) => {
    setTeams(teams.map(t => 
      t.id === teamId 
        ? {...t, players: t.players.map(p => p.id === playerId ? {...p, ...updates} : p)}
        : t
    ));
    setEditingPlayer(null);
  };

  const addPlayer = (teamId: string) => {
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
  };

  const updateMatchScore = (matchId: string, homeScore: number, awayScore: number) => {
    setMatches(matches.map(m => 
      m.id === matchId ? {...m, homeScore, awayScore, status: 'finished' as const} : m
    ));
    setEditingMatch(null);
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
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Icon name="Trophy" size={40} className="text-primary" />
            <h1 className="text-5xl font-black text-primary">ФУТБОЛЬНАЯ ЛИГА</h1>
          </div>
          <p className="text-muted-foreground text-lg">Сезон 2025/2026</p>
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

          <TabsContent value="standings" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Trophy" size={24} className="text-accent" />
                  Турнирная таблица
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12 text-center">#</TableHead>
                      <TableHead>Команда</TableHead>
                      <TableHead className="text-center">И</TableHead>
                      <TableHead className="text-center">В</TableHead>
                      <TableHead className="text-center">Н</TableHead>
                      <TableHead className="text-center">П</TableHead>
                      <TableHead className="text-center">МЗ</TableHead>
                      <TableHead className="text-center">МП</TableHead>
                      <TableHead className="text-center">РМ</TableHead>
                      <TableHead className="text-center font-bold">О</TableHead>
                      <TableHead className="text-center">Форма</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedTeams.map((team, index) => (
                      <TableRow
                        key={team.id}
                        className="hover:bg-primary/5 transition-colors"
                      >
                        <TableCell className="text-center font-bold">
                          {index + 1}
                        </TableCell>
                        <TableCell className="font-bold text-base">
                          {team.name}
                        </TableCell>
                        <TableCell className="text-center">{team.played}</TableCell>
                        <TableCell className="text-center text-green-600 font-semibold">
                          {team.won}
                        </TableCell>
                        <TableCell className="text-center text-yellow-600 font-semibold">
                          {team.drawn}
                        </TableCell>
                        <TableCell className="text-center text-red-600 font-semibold">
                          {team.lost}
                        </TableCell>
                        <TableCell className="text-center">{team.goalsFor}</TableCell>
                        <TableCell className="text-center">{team.goalsAgainst}</TableCell>
                        <TableCell className="text-center font-semibold">
                          {team.goalsFor - team.goalsAgainst > 0 ? '+' : ''}
                          {team.goalsFor - team.goalsAgainst}
                        </TableCell>
                        <TableCell className="text-center font-black text-lg text-primary">
                          {team.points}
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
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="animate-fade-in space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="CalendarClock" size={24} className="text-accent" />
                  Предстоящие матчи
                </CardTitle>
              </CardHeader>
              <CardContent>
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
                          <div className="font-bold text-right flex-1">
                            {match.homeTeam}
                          </div>
                          <Badge variant="outline" className="px-3">
                            VS
                          </Badge>
                          <div className="font-bold text-left flex-1">
                            {match.awayTeam}
                          </div>
                        </div>
                      </div>
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
                    </div>
                  ))}
                </div>
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
                          <div className="font-bold text-right flex-1">
                            {match.homeTeam}
                          </div>
                          <Badge
                            variant="secondary"
                            className="px-4 py-1 text-base font-black"
                          >
                            {match.homeScore} : {match.awayScore}
                          </Badge>
                          <div className="font-bold text-left flex-1">
                            {match.awayTeam}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;