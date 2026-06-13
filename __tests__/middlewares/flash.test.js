import {beforeEach, describe, expect, it, jest} from '@jest/globals';
import flash from '../../src/middlewares/flash.js';

describe('Flash Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { session: {} };
    res = { locals: {} };
    next = jest.fn();
    flash(req, res, next);
  });

  it('should initialize flash storage and call next', () => {
    expect(next).toHaveBeenCalled();
  });

  it('should store a flash message by type', () => {
    req.flash('success', 'Operation completed');
    expect(req.session.flash.success).toEqual(['Operation completed']);
  });

  it('should store multiple messages of the same type', () => {
    req.flash('error', 'First error');
    req.flash('error', 'Second error');
    expect(req.session.flash.error).toEqual(['First error', 'Second error']);
  });

  it('should retrieve and clear messages by type', () => {
    req.flash('success', 'Message 1');
    req.flash('success', 'Message 2');

    const messages = req.flash('success');
    expect(messages).toEqual(['Message 1', 'Message 2']);
    expect(req.session.flash.success).toEqual([]);
  });

  it('should retrieve and clear all flash messages', () => {
    req.flash('success', 'Success message');
    req.flash('error', 'Error message');

    const allMessages = req.flash();
    expect(allMessages.success).toEqual(['Success message']);
    expect(allMessages.error).toEqual(['Error message']);
    expect(req.session.flash.success).toEqual([]);
    expect(req.session.flash.error).toEqual([]);
  });

  it('should return empty array when getting unset type', () => {
    const messages = req.flash('warning');
    expect(messages).toEqual([]);
  });

  it('should store messages in an arbitrary type', () => {
    req.flash('info', 'Some info');
    expect(req.session.flash.info).toEqual(['Some info']);
  });
});
