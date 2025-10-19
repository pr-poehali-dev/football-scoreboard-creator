import json
import os
from typing import Dict, Any, List
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для управления футбольным турниром - команды, игроки, матчи
    Args: event с httpMethod, body, queryStringParameters; context с request_id
    Returns: HTTP response с данными турнира
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    db_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(db_url)
    
    try:
        if method == 'GET':
            path = event.get('queryStringParameters', {}).get('path', 'teams')
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                if path == 'teams':
                    cur.execute('SELECT * FROM teams ORDER BY points DESC, (goals_for - goals_against) DESC')
                    teams = cur.fetchall()
                    
                    for team in teams:
                        cur.execute('SELECT * FROM players WHERE team_id = %s', (team['id'],))
                        team['players'] = cur.fetchall()
                    
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'teams': teams}, default=str),
                        'isBase64Encoded': False
                    }
                
                elif path == 'matches':
                    cur.execute('SELECT * FROM matches ORDER BY date')
                    matches = cur.fetchall()
                    
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'matches': matches}, default=str),
                        'isBase64Encoded': False
                    }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                if action == 'update_team':
                    team_id = body.get('team_id')
                    updates = body.get('updates', {})
                    
                    set_clause = ', '.join([f"{k} = %s" for k in updates.keys()])
                    values = list(updates.values()) + [team_id]
                    
                    cur.execute(f'UPDATE teams SET {set_clause} WHERE id = %s', values)
                    conn.commit()
                    
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'success': True}),
                        'isBase64Encoded': False
                    }
                
                elif action == 'add_player':
                    player = body.get('player')
                    cur.execute(
                        'INSERT INTO players (id, team_id, name, position, goals, assists, matches) VALUES (%s, %s, %s, %s, %s, %s, %s)',
                        (player['id'], player['team_id'], player['name'], player['position'], 
                         player.get('goals', 0), player.get('assists', 0), player.get('matches', 0))
                    )
                    conn.commit()
                    
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'success': True}),
                        'isBase64Encoded': False
                    }
                
                elif action == 'update_player':
                    player_id = body.get('player_id')
                    updates = body.get('updates', {})
                    
                    set_clause = ', '.join([f"{k} = %s" for k in updates.keys()])
                    values = list(updates.values()) + [player_id]
                    
                    cur.execute(f'UPDATE players SET {set_clause} WHERE id = %s', values)
                    conn.commit()
                    
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'success': True}),
                        'isBase64Encoded': False
                    }
                
                elif action == 'add_match':
                    match = body.get('match')
                    cur.execute(
                        'INSERT INTO matches (id, date, home_team, away_team, home_score, away_score, status) VALUES (%s, %s, %s, %s, %s, %s, %s)',
                        (match['id'], match['date'], match['homeTeam'], match['awayTeam'],
                         match.get('homeScore'), match.get('awayScore'), match.get('status', 'scheduled'))
                    )
                    conn.commit()
                    
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'success': True}),
                        'isBase64Encoded': False
                    }
                
                elif action == 'update_match':
                    match_id = body.get('match_id')
                    updates = body.get('updates', {})
                    
                    if 'homeScore' in updates:
                        updates['home_score'] = updates.pop('homeScore')
                    if 'awayScore' in updates:
                        updates['away_score'] = updates.pop('awayScore')
                    
                    set_clause = ', '.join([f"{k} = %s" for k in updates.keys()])
                    values = list(updates.values()) + [match_id]
                    
                    cur.execute(f'UPDATE matches SET {set_clause} WHERE id = %s', values)
                    conn.commit()
                    
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'success': True}),
                        'isBase64Encoded': False
                    }
                
                elif action == 'add_matches_bulk':
                    matches = body.get('matches', [])
                    for match in matches:
                        cur.execute(
                            'INSERT INTO matches (id, date, home_team, away_team, home_score, away_score, status) VALUES (%s, %s, %s, %s, %s, %s, %s)',
                            (match['id'], match['date'], match['homeTeam'], match['awayTeam'],
                             match.get('homeScore'), match.get('awayScore'), match.get('status', 'scheduled'))
                        )
                    conn.commit()
                    
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'success': True}),
                        'isBase64Encoded': False
                    }
        
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid request'}),
            'isBase64Encoded': False
        }
    
    finally:
        conn.close()
